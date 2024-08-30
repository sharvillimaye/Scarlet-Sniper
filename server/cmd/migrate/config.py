import requests
import os
from enum import Enum
from dotenv import load_dotenv

import mysql.connector

Status = Enum('Status', ['OPEN', 'CLOSED'])

# Load environment variables from .env file
load_dotenv()

# Get database connection details from environment variables
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

# Connect to the MySQL database
db = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name
)

# Create a cursor object to execute SQL queries
cursor = db.cursor()

# API link configuration
year = 2024
term = 9
campus = "NB"
url = f"https://sis.rutgers.edu/soc/api/courses.json?year={year}&term={term}&campus={campus}"

# Call the API and get the relevant items
response = requests.get(url)
dump = response.json()

# Interate through the response and populate the DB
for course in dump:
    title = ""
    courseNumber = 0
    courseStatus = Status.CLOSED
    if "title" in course:
        title = course["title"]
    for section in course['sections']:
        if "index" in section:
            courseNumber = section["index"]
        if "openStatus" in section:
            openStatus = section["openStatus"]
            if openStatus:
                courseStatus = Status.OPEN
            else:
                courseStatus = Status.CLOSED
            
        sql = "INSERT INTO courses (courseNumber, title, status) VALUES (%s, %s, %s)"
        values = (courseNumber, title, courseStatus.name)
        cursor.execute(sql, values)        

# Commit the changes and close the database connection 
db.commit()
db.close()