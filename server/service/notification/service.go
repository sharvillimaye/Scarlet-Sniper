package notification

import (
	"github.com/sharvillimaye/scarlet-sniper/server/types"
)

type Service struct {
	userStore   types.UserStore
	courseStore types.CourseStore
}

const baseLink = "https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92024&indexList="

func NewService(userStore types.UserStore, courseStore types.CourseStore) *Service {
	return &Service{userStore: userStore, courseStore: courseStore}
}

func (s *Service) SendNotifications(subscriptions []types.Subscription) error {
	//for _, subscription := range subscriptions {
	//user, err := s.userStore.GetUserByID(subscription.UserID)
	//if err != nil {
	//	return err
	//}
	//
	//}
	return nil
}
