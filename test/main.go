package main

import (
	"log"
	"strconv"
	// "sync"

	expo "github.com/oliveroneill/exponent-server-sdk-golang/sdk"
)

const baseLink = "https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=92024&indexList="

func main() {
	pushNotificationClient := expo.NewPushClient(nil)

	pushToken, err := expo.NewExponentPushToken("ExponentPushToken[vEziiZC4DfJjFWmduFpJQ9]")
	if err != nil {
		log.Print("Error creating push token:", err)
		return
	}

	link := baseLink + strconv.Itoa(12345)
	message := &expo.PushMessage{
		To:   []expo.ExponentPushToken{pushToken},
		Body: "New course update!",
		Data: map[string]string{"url": link},
	}
	
	_, err = pushNotificationClient.Publish(message)
	if err != nil {
		log.Print("Retrying to send notification")
		_, err = pushNotificationClient.Publish(message)
		if err != nil {
		log.Print("Failed to resend notification:", err)
			return
		}
	}			
}