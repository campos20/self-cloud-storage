def get_my_user():
    return {'username': 'user', 'email': 'email@example.com'}


def create_user(email: str, password: str):
    return {'email': email, 'active': True}
