package subscription

import (
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/sharvillimaye/scarlet-sniper/server/utils"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sharvillimaye/scarlet-sniper/server/service/auth"
	"github.com/sharvillimaye/scarlet-sniper/server/types"
)

type Handler struct {
	store       types.SubscriptionStore
	courseStore types.CourseStore
	userStore   types.UserStore
}

func NewHandler(store types.SubscriptionStore, courseStore types.CourseStore, userStore types.UserStore) *Handler {
	return &Handler{store: store, courseStore: courseStore, userStore: userStore}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/subscriptions", auth.WithJWTAuth(h.getSubscriptions, h.userStore)).Methods("GET")
	router.HandleFunc("/subscriptions", auth.WithJWTAuth(h.handleSubscribe, h.userStore)).Methods("POST")
	router.HandleFunc("/subscriptions", auth.WithJWTAuth(h.handleUnsubscribe, h.userStore)).Methods("DELETE")
}

func (h *Handler) getSubscriptions(w http.ResponseWriter, r *http.Request) {
	userID := auth.GetUserIDFromContext(r.Context())

	_, err := h.userStore.GetUserByID(userID)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user not found: %v", err))
		return
	}

	subscriptions, err := h.store.GetSubscriptionsByUserID(userID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to fetch subscriptions: %v", err))
		return
	}

	var courses []types.Course
	for _, subscription := range subscriptions {
		course, err := h.courseStore.GetCourseByID(subscription.CourseID)
		if err != nil {
			utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("course not found: %v", err))
			return
		}
		courses = append(courses, *course)
	}

	if err = utils.WriteJSON(w, http.StatusOK, courses); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
}

func (h *Handler) handleSubscribe(w http.ResponseWriter, r *http.Request) {
	userID := auth.GetUserIDFromContext(r.Context())

	var subscriptionRequest types.SubscriptionRequestPayload
	if err := utils.ParseJSON(r, &subscriptionRequest); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(subscriptionRequest); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", errors))
		return
	}

	user, err := h.userStore.GetUserByID(userID)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user not found: %v", err))
		return
	}

	course, err := h.courseStore.GetCourseByNumber(subscriptionRequest.CourseNumber)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("course not found: %v", err))
		return
	}

	subscriptions, err := h.store.CheckSubscriptionByUserIDAndCourseID(user.ID, course.ID)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("subscription not found: %d", course.CourseNumber))
		return
	}
	if subscriptions != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("subscription for course number %d already exists", course.CourseNumber))
		return
	}

	err = h.store.CreateSubscription(types.Subscription{
		UserID:   user.ID,
		CourseID: course.ID,
	})
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if err = utils.WriteJSON(w, http.StatusCreated, map[string]types.Course{"course": *course}); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
}

func (h *Handler) handleUnsubscribe(w http.ResponseWriter, r *http.Request) {
	userID := auth.GetUserIDFromContext(r.Context())

	var subscriptionRequest types.SubscriptionRequestPayload
	if err := utils.ParseJSON(r, &subscriptionRequest); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(subscriptionRequest); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", errors))
		return
	}

	u, err := h.userStore.GetUserByID(userID)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user not found: %v", err))
		return
	}
	if u == nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("user not found: %v", err))
		return
	}

	course, err := h.courseStore.GetCourseByNumber(subscriptionRequest.CourseNumber)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("course not found: %v", err))
		return
	}
	if course == nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("user not found: %v", err))
		return
	}

	subscriptions, err := h.store.CheckSubscriptionByUserIDAndCourseID(userID, course.ID)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("subscription for course number %d not found", course.CourseNumber))
		return
	}
	if subscriptions == nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("subscription for course number %d not found", course.CourseNumber))
		return
	}

	for _, subscription := range subscriptions {
		if err = h.store.DeleteSubscription(subscription); err != nil {
			utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("unable to delete subscription"))
			return
		}
	}

	if err = utils.WriteJSON(w, http.StatusOK, nil); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
}
