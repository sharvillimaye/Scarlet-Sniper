package api

import (
	"database/sql"
	"github.com/sharvillimaye/scarlet-sniper/server/service/health"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sharvillimaye/scarlet-sniper/server/service/course"
	"github.com/sharvillimaye/scarlet-sniper/server/service/monitor"
	"github.com/sharvillimaye/scarlet-sniper/server/service/notification"
	"github.com/sharvillimaye/scarlet-sniper/server/service/subscription"
	"github.com/sharvillimaye/scarlet-sniper/server/service/user"
)

type APIServer struct {
	addr string
	db   *sql.DB
}

func NewAPIServer(addr string, db *sql.DB) *APIServer {
	return &APIServer{
		addr: addr,
		db:   db,
	}
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1/").Subrouter()

	healthHandler := health.NewHandler()
	healthHandler.RegisterRoutes(subrouter)

	userStore := user.NewStore(s.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	courseStore := course.NewStore(s.db)

	subscriptionStore := subscription.NewStore(s.db)
	subscriptionHandler := subscription.NewHandler(subscriptionStore, courseStore, userStore)
	subscriptionHandler.RegisterRoutes(subrouter)

	notificationService := notification.NewService(subscriptionStore)

	monitorService := monitor.NewService(notificationService, subscriptionStore, courseStore)
	go monitorService.MonitorOpenCourses()

	log.Println("Listening on", s.addr)

	return http.ListenAndServe(s.addr, router)
}
