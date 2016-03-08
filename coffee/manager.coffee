
manager = angular.module 'manager', ['ngMaterial', 'shared']

manager.controller 'MainCtrl',
    class
        constructor: (@tabsService) ->
