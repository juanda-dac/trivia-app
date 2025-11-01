from exceptions.base_exception import AppException

class UnavailableSurvey(AppException):
    def __init__(self, message: str = "El cuestionario no está disponible"):
        super().__init__(message, 400)
        
class FinishedSurvey(AppException):
    def __init__(self, message: str = "Cuestionario finalizado"):
        super().__init__(message, 419)
        
class SurveyNotFound(AppException):
    def __init__(self, message: str = "El cuestionario no existe"):
        super().__init__(message, 404)

class UserExists(AppException):
    def __init__(self, message: str = "El usuario que intentas registrar ya existe"):
        super().__init__(message, 401)
        
class UserNotFound(AppException):
    def __init__(self, message: str = "El usuario no existe"):
        super().__init__(message, 404)
        
class OutOfRange(AppException):
    def __init__(self, message: str = "El rango de respuestas no está permitido"):
        super().__init__(message, 403)
        
class QuestionUnavailable(AppException):
    def __init__(self, message: str = "La pregunta que intentas modificar no es accesible"):
        super().__init__(message, 403)