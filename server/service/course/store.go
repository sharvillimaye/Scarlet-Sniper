package course

import (
	"database/sql"
	"github.com/sharvillimaye/scarlet-sniper/server/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func scanRowIntoSubscription(rows *sql.Rows) (*types.Course, error) {
	course := new(types.Course)

	err := rows.Scan(
		&course.ID,
		&course.CourseNumber,
		&course.Title,
		&course.Status,
		&course.LastChecked,
	)
	if err != nil {
		return nil, err
	}

	return course, nil
}

func (s *Store) GetCourseByNumber(courseNumber int) (*types.Course, error) {
	rows, err := s.db.Query("SELECT * FROM courses WHERE courseNumber = ?", courseNumber)
	if err != nil {
		return nil, err
	}

	course := new(types.Course)
	for rows.Next() {
		course, err = scanRowIntoSubscription(rows)
		if err != nil {
			return nil, err
		}
	}

	return course, nil
}

func (s *Store) GetCourseByID(id int) (*types.Course, error) {
	rows, err := s.db.Query("SELECT * FROM courses WHERE id = ?", id)
	if err != nil {
		return nil, err
	}

	course := new(types.Course)
	for rows.Next() {
		course, err = scanRowIntoSubscription(rows)
		if err != nil {
			return nil, err
		}
	}

	return course, nil
}

func (s *Store) CreateCourse(course *types.Course) error {
	_, err := s.db.Exec("INSERT INTO courses (id, courseNumber, title, status) VALUES (?, ?, ?, ?)", course.ID, course.CourseNumber, course.Title, course.Status)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) UpdateCourse(course *types.Course) error {
	_, err := s.db.Exec("UPDATE courses SET title = ?, status = ? WHERE id = ?", course.Title, course.Status, course.ID)
	if err != nil {
		return err
	}
	return nil
}