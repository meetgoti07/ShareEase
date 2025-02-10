FROM python:3.12

WORKDIR /code/

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY manage.py .

COPY ./backend ./backend/
COPY ./property ./property/
COPY ./user ./user/
COPY ./search ./search/
COPY ./product ./product/
COPY ./admin_panel ./admin_panel/
EXPOSE 8000

CMD ["sh", "-c", " python manage.py makemigrations && python manage.py migrate  && python manage.py runserver 0.0.0.0:8000"]