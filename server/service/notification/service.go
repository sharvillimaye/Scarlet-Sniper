package notification

import (
	"log"
	"strconv"
	"sync"

	expo "github.com/oliveroneill/exponent-server-sdk-golang/sdk"
	"github.com/sharvillimaye/scarlet-sniper/server/types"
)

type Service struct {
	subscriptionStore      types.SubscriptionStore
	pushNotificationClient *expo.PushClient
}

const baseLink = "https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92024&indexList="

func NewService(subscriptionStore types.SubscriptionStore) *Service {
	return &Service{subscriptionStore: subscriptionStore, pushNotificationClient: expo.NewPushClient(nil)}
}

func (s *Service) SendNotifications(subscriptions []types.Subscription) {
	var wg sync.WaitGroup

	for _, subscription := range subscriptions {
		wg.Add(1)
		go func(subscription types.Subscription) {
			defer wg.Done()

			if subscription.NotificationToken == "" {
				log.Print("No notification token for user:", subscription.UserID)
				return
			}

			pushToken, err := expo.NewExponentPushToken(subscription.NotificationToken)
			if err != nil {
				log.Print("Error creating push token:", err)
				return
			}

			link := baseLink + strconv.Itoa(subscription.CourseID)
			message := &expo.PushMessage{
				To:   []expo.ExponentPushToken{pushToken},
				Body: "Check your course schedule",
				Data: map[string]string{"url": link},
			}

			_, err = s.pushNotificationClient.Publish(message)
			if err != nil {
				log.Print("Retrying to send notification")
				_, err = s.pushNotificationClient.Publish(message)
				if err != nil {
				log.Print("Failed to resend notification:", err)
					return
				}
			}

			if err = s.subscriptionStore.DeleteSubscription(subscription); err != nil {
				log.Print("Error deleting subscription:", err)
			}
		} (subscription)
	}

	wg.Wait()
}
