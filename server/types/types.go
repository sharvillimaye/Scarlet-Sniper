package types

import "time"

type User struct {
	ID          int       `json:"id"`
	Email       string    `json:"email"`
	PhoneNumber string    `json:"phoneNumber"`
	Username    string    `json:"username"`
	Password    string    `json:"-"`
	CreatedAt   time.Time `json:"createdAt"`
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(User) error
}

type RegisterUserPayload struct {
	Username    string `json:"username" validate:"required"`
	PhoneNumber string `json:"phoneNumber" validate:"required,e164"`
	Email       string `json:"email" validate:"required,email"`
	Password    string `json:"password" validate:"required,min=8,max=130"`
}

type LoginUserPayload struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type Course struct {
	ID           int          `json:"id"`
	CourseNumber int          `json:"courseNumber"`
	Title        string       `json:"title"`
	Status       CourseStatus `json:"status"`
	LastChecked  time.Time    `json:"lastChecked"`
}

type CourseStatus int

const (
	OPEN CourseStatus = iota
	CLOSED
)

type CourseStore interface {
	GetCourseByNumber(courseNumber int) (*Course, error)
	GetCourseByID(id int) (*Course, error)
	CreateCourse(course Course) error
	UpdateCourse(course Course) error
}

type Subscription struct {
	CourseID int `json:"courseID"`
	UserID   int `json:"userID"`
}

type SubscriptionStore interface {
	GetSubscriptionsByUserID(userID int) ([]Subscription, error)
	GetSubscriptionsByCourseID(courseID int) ([]Subscription, error)
	CheckSubscriptionByUserIDAndCourseID(userID int, courseID int) (*Subscription, error)
	CreateSubscription(subscription Subscription) error
	DeleteSubscription(subscription Subscription) error
}

type SubscriptionRequestPayload struct {
	CourseNumber int `json:"courseNumber" validate:"required"`
}
