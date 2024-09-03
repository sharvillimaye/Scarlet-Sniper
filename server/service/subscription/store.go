package subscription

import (
	"database/sql"
	"github.com/sharvillimaye/scarlet-sniper/server/types"
	"log"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func scanRowIntoSubscription(rows *sql.Rows) (*types.Subscription, error) {
	subscription := new(types.Subscription)

	err := rows.Scan(
		&subscription.UserID,
		&subscription.CourseID,
	)
	if err != nil {
		return nil, err
	}

	return subscription, nil
}

func (s *Store) GetSubscriptionsByUserID(userID int) ([]types.Subscription, error) {
	rows, err := s.db.Query("SELECT * FROM user_course_subscriptions WHERE userID = ?", userID)
	if err != nil {
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Println("Error closing row:", err)
		}
	}(rows)

	var subscriptions []types.Subscription
	for rows.Next() {
		subscription, err := scanRowIntoSubscription(rows)
		if err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, *subscription)
	}

	return subscriptions, nil
}

func (s *Store) GetSubscriptionsByCourseID(courseID int) ([]types.Subscription, error) {
	rows, err := s.db.Query("SELECT * FROM user_course_subscriptions WHERE courseID = ?", courseID)
	if err != nil {
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Println("Error closing row:", err)
		}
	}(rows)

	var subscriptions []types.Subscription
	for rows.Next() {
		subscription, err := scanRowIntoSubscription(rows)
		if err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, *subscription)
	}

	return subscriptions, nil
}

func (s *Store) CheckSubscriptionByUserIDAndCourseID(userID int, courseID int) ([]types.Subscription, error) {
	rows, err := s.db.Query("SELECT * FROM user_course_subscriptions WHERE userID = ? AND courseID = ?", userID, courseID)
	if err != nil {
		print(err)
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Println("Error closing row:", err)
		}
	}(rows)

	var subscriptions []types.Subscription
	for rows.Next() {
		subscription, err := scanRowIntoSubscription(rows)
		if err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, *subscription)
	}

	if subscriptions == nil || len(subscriptions) == 0 {
		return nil, nil
	}

	return subscriptions, nil
}

func (s *Store) CreateSubscription(subscription types.Subscription) error {
	_, err := s.db.Exec("INSERT INTO user_course_subscriptions (userID, courseID) VALUES (?, ?)", subscription.UserID, subscription.CourseID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) DeleteSubscription(subscription types.Subscription) error {
	_, err := s.db.Exec("DELETE FROM user_course_subscriptions WHERE userID = ? AND courseID = ?", subscription.UserID, subscription.CourseID)
	if err != nil {
		return err
	}
	return nil
}
