package subscription

import (
	"github.com/sharvillimaye/scarlet-sniper/server/types"
)

// TODO: make test cases for the routes

type mockSubscriptionStore struct{}
type mockCourseStore struct{}
type mockUserStore struct{}

func (m *mockSubscriptionStore) GetSubscriptionsByUserID(userID int) ([]types.Subscription, error) {
	return nil, nil
}

func (m *mockSubscriptionStore) GetSubscriptionsByCourseID(courseID int) ([]types.Subscription, error) {
	return nil, nil
}

func (m *mockSubscriptionStore) CheckSubscriptionByUserIDAndCourseID(userID int, courseID int) (*types.Subscription, error) {
	return nil, nil
}

func (m *mockSubscriptionStore) CreateSubscription(subscription types.Subscription) error {
	return nil
}

func (m *mockSubscriptionStore) DeleteSubscription(subscription types.Subscription) error {
	return nil
}

func (m *mockCourseStore) GetCourseByNumber(courseNumber int) (*types.Course, error) {
	return nil, nil
}

func (m *mockCourseStore) GetCourseByID(id int) (*types.Course, error) {
	return nil, nil
}

func (m *mockCourseStore) CreateCourse(course types.Course) error {
	return nil
}

func (m *mockCourseStore) UpdateCourse(course types.Course) error {
	return nil
}

func (m *mockUserStore) GetUserByEmail(email string) (*types.User, error) {
	return nil, nil
}

func (m *mockUserStore) CreateUser(u types.User) error {
	return nil
}

func (m *mockUserStore) GetUserByID(id int) (*types.User, error) {
	return nil, nil
}
