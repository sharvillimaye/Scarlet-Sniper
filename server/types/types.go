package types

import "time"

type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"createdAt"`
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(User) error
	DeleteUserByID(int) error
}

type RegisterUserPayload struct {
	Username string `json:"username" validate:"required,max=320"`
	Email    string `json:"email" validate:"required,email,max=320"`
	Password string `json:"password" validate:"required,min=8,max=130"`
}

type LoginUserPayload struct {
	Email    string `json:"email" validate:"required,email,max=320"`
	Password string `json:"password" validate:"required,max=130"`
}

type Course struct {
	ID           int       `json:"id"`
	CourseNumber int       `json:"courseNumber"`
	Title        string    `json:"title"`
	Status       string    `json:"status"`
	LastChecked  time.Time `json:"lastChecked"`
}

type CourseStore interface {
	GetAllCourses() ([]Course, error)
	GetCourseByNumber(courseNumber int) (*Course, error)
	GetCourseByID(id int) (*Course, error)
	CreateCourse(course *Course) error
	UpdateCourse(course *Course) error
}

type Subscription struct {
	CourseID          int    `json:"courseID"`
	UserID            int    `json:"userID"`
	NotificationToken string `json:"notificationToken"`
}

type SubscriptionStore interface {
	GetSubscriptionsByUserID(userID int) ([]Subscription, error)
	GetSubscriptionsByCourseID(courseID int) ([]Subscription, error)
	CheckSubscriptionByUserIDAndCourseID(userID int, courseID int) ([]Subscription, error)
	CreateSubscription(subscription Subscription) error
	DeleteSubscription(subscription Subscription) error
}

type SubscriptionRequestPayload struct {
	CourseNumber      int    `json:"courseNumber" validate:"required"`
	NotificationToken string `json:"notificationToken"`
}

type UnsubscriptionRequestPayload struct {
	CourseNumber int `json:"courseNumber" validate:"required"`
}

type NotificationService interface {
	SendNotifications(subscriptions []Subscription)
}
