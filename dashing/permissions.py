# -*- encoding: utf-8 -*-


class BasePermission(object):
    """
    A base class from which all permission classes should inherit.
    """

    def has_permission(self, request):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return True


class AllowAny(BasePermission):
    """
    Allow any access.
    """
    def has_permission(self, request):
        return True


class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request):
        return request.user and request.user.is_authenticated()


class IsAdminUser(BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request):
        return request.user and request.user.is_staff
