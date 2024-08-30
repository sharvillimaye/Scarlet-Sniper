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
	rows, err := s.db.Query("SELECT * FROM courses WHERE course_number = ?", courseNumber)
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
