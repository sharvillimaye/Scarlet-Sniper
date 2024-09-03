package api

import (
	"database/sql"
	"github.com/rs/cors"
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

	userStore := user.NewStore(s.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	courseStore := course.NewStore(s.db)

	subscriptionStore := subscription.NewStore(s.db)
	subscriptionHandler := subscription.NewHandler(subscriptionStore, courseStore, userStore)
	subscriptionHandler.RegisterRoutes(subrouter)

	notificationService := notification.NewService(userStore, courseStore)

	monitorService := monitor.NewService(notificationService, subscriptionStore, courseStore)
	go monitorService.MonitorOpenCourses()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8081", "exp://192.168.1.18:8081"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Println("Listening on", s.addr)

	return http.ListenAndServe(s.addr, handler)
}
