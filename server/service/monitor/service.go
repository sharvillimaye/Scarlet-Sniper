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
)

type Service struct {
	apiURL            string
	subscriptionStore types.SubscriptionStore
	courseStore       types.CourseStore
}

func NewService(subscriptionStore types.SubscriptionStore, courseStore types.CourseStore) *Service {
	return &Service{apiURL: "https://sis.rutgers.edu/soc/api/openSections.json?year=2024&term=9&campus=NB", subscriptionStore: subscriptionStore, courseStore: courseStore}
}

func (s *Service) MonitorOpenCourses() {
	ticker := time.NewTicker(1000 * time.Millisecond)
	go func() {
		for {
			select {
			case t := <-ticker.C:
				s.check(s.apiURL)
				fmt.Println("Checking at ", t)
			}
		}
	}()
	select {}
}

func (s *Service) check(url string) {
	response, err := http.Get(url)
	if err != nil {
		log.Fatal("Error getting response:", err)
		return
	}

	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatal("Error reading response:", err)
		return
	}

	var stringArray []string
	err = json.Unmarshal(responseData, &stringArray)
	if err != nil {
		log.Fatal("Error parsing JSON:", err)
		return
	}

	openCourseNumbers := make([]int, len(stringArray))
	for i, str := range stringArray {
		openCourseNumbers[i], err = strconv.Atoi(str)
		if err != nil {
			log.Fatal("Error converting string to int:", err)
			return
		}
	}

	for _, openCourseNumber := range openCourseNumbers {
		course, err := s.courseStore.GetCourseByNumber(openCourseNumber)
		if err != nil {
			log.Fatal("Error getting course by number:", err)
		}
		if course.Status == "CLOSED" {
			course.Status = "OPEN"
			err = s.courseStore.UpdateCourse(course)
			if err != nil {
				log.Fatal("Error updating course:", err)
			}
		}
	}
}
