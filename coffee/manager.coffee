
manager = angular.module 'manager', ['ngMaterial', 'shared']

manager.controller 'MainCtrl',
    class
        constructor: (@tagsService) ->
            @tags = @tagsService.all()
            @tags.push('teste')
