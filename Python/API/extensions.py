'''
Sets a global variable for all other .py files to use SQLAlchemy.
'''
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()