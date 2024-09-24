package monitor

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/sharvillimaye/scarlet-sniper/server/types"
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
		for range ticker.C {
			s.check(apiURL)
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
			return
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
		return
	}

	var wg sync.WaitGroup

	for _, course := range courses {
		if course.Status == "CLOSED" {
			if _, exists := openCourseNumbers[course.CourseNumber]; exists {
				// The number is in the set
				subscriptions, err := s.subscriptionStore.GetSubscriptionsByCourseID(course.ID)
				if err != nil {
					log.Print("Error getting subscriptions to course:", err)
					return
				}

				wg.Add(1)
				go func(subscriptions []types.Subscription) {
					defer wg.Done()
					s.notificationService.SendNotifications(subscriptions)
				}(subscriptions)

				course.Status = "OPEN"
				err = s.courseStore.UpdateCourse(&course)
				if err != nil {
					log.Print("Error updating course:", err)
					return
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
					return
				}
			}
		}
	}

	wg.Wait()
}
