package monitor

import (
	"encoding/json"
	"fmt"
	"github.com/sharvillimaye/scarlet-sniper/server/types"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"
	"sync"
)

type Service struct {
	notificationService types.NotificationService
	subscriptionStore   types.SubscriptionStore
	courseStore         types.CourseStore
}

const apiURL = "https://sis.rutgers.edu/soc/api/openSections.json?year=2024&term=9&campus=NB"

func NewService(notificationService types.NotificationService, subscriptionStore types.SubscriptionStore, courseStore types.CourseStore) *Service {
	return &Service{notificationService: notificationService, subscriptionStore: subscriptionStore, courseStore: courseStore}
}

func (s *Service) MonitorOpenCourses() {
	ticker := time.NewTicker(1000 * time.Millisecond)
	go func() {
		for {
			select {
			case <-ticker.C:
				fmt.Printf("Checking at %s\n", time.Now().Format(time.RFC3339))
				s.check(apiURL)
			}
		}
	}()
	select {}
}

func (s *Service) check(url string) {
	response, err := http.Get(url)
	if err != nil {
		log.Print("Error getting response:", err)
		return
	}

	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		log.Print("Error reading response:", err)
		return
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Print("Error closing body:", err)
		}
	}(response.Body)

	var stringArray []string
	err = json.Unmarshal(responseData, &stringArray)
	if err != nil {
		log.Print("Error parsing JSON:", err)
		return
	}

	openCourseNumbers := make(map[int]struct{})
	for _, str := range stringArray {
		num, err := strconv.Atoi(str)
		if err != nil {
			log.Print("Error converting string to int:", err)
			return
		}
		openCourseNumbers[num] = struct{}{}
	}

	courses, err := s.courseStore.GetAllCourses()
	if err != nil {
		log.Print("Error getting all courses:", err)
	}

	var wg sync.WaitGroup

	for _, course := range courses {
		if course.Status == "CLOSED" {
			if _, exists := openCourseNumbers[course.CourseNumber]; exists {
				// The number is in the set
				subscriptions, err := s.subscriptionStore.GetSubscriptionsByCourseID(course.ID)
				if err != nil {
					log.Print("Error getting subscriptions to course:", err)
				}
				
				wg.Add(1)
                go func(subscriptions []types.Subscription) {
                    defer wg.Done()
                    s.notificationService.SendNotifications(subscriptions)
                } (subscriptions)

				course.Status = "OPEN"
				err = s.courseStore.UpdateCourse(&course)
				if err != nil {
					log.Print("Error updating course:", err)
				}
			} else {
				continue
			}
		} else {
			// Course is open
			if _, exists := openCourseNumbers[course.CourseNumber]; exists {
				continue
			} else {
				// The number is not in the set
				println("Updating", course.CourseNumber)

				course.Status = "CLOSED"
				err = s.courseStore.UpdateCourse(&course)
				if err != nil {
					log.Print("Error updating course:", err)
				}
			}
		}
	}

	wg.Wait()
}
