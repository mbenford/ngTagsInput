'use strict';

describe('tags-input directive', function() {
    var $compile, $scope, $timeout, $document, $window,
        isolateScope, element, tiUtil;

    beforeEach(function() {
        jasmine.addMatchers(customMatchers);

        module('ngTagsInput');

        inject(function(_$compile_, _$rootScope_, _$document_, _$timeout_, _$window_, _tiUtil_) {
            $compile = _$compile_;
            $scope = _$rootScope_;
            $document = _$document_;
            $timeout = _$timeout_;
            $window = _$window_;
            tiUtil = _tiUtil_;
        });
    });

    function compile() {
        var options = jQuery.makeArray(arguments).join(' ');
        var template = '<tags-input ng-model="tags" ' + options + '></tags-input>';

        element = $compile(template)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }

    function compileWithForm() {
        var options = jQuery.makeArray(arguments).join(' ');
        var template = '<form name="form"><tags-input ng-model="tags" ' + options + '></tags-input></form>';

        element = $compile(template)($scope);
        $scope.$digest();
        isolateScope = element.children().isolateScope();
    }

    function generateTags(count) {
        return range(count, function(index) {
            return { text: 'Tag' + (index + 1) };
        });
    }

    function getTags() {
        return element.find('li');
    }

    function getTag(index) {
        return getTags().eq(index);
    }

    function getTagText(index) {
        return getTag(index).find('ti-tag-item > ng-include > span').html();
    }

    function getRemoveButton(index) {
        return getTag(index).find('ti-tag-item > ng-include > a').first();
    }

    function getInput() {
        return element.find('input');
    }

    function newTag(tag, key) {
        key = key || KEYS.enter;

        for(var i = 0; i < tag.length; i++) {
            sendKeyPress(tag.charCodeAt(i));
        }
        sendKeyDown(key);
    }

    function sendKeyPress(charCode) {
        var input = getInput();
        var event = jQuery.Event('keypress', { charCode: charCode });

        input.trigger(event);
        if (!event.isDefaultPrevented()) {
            changeInputValue(input.val() + String.fromCharCode(charCode));
        }
    }

    function sendKeyDown(keyCode, properties) {
        var event = jQuery.Event('keydown', angular.extend({ keyCode: keyCode }, properties || {}));
        getInput().trigger(event);

        return event;
    }

    function sendBackspace() {
        var event = sendKeyDown(KEYS.backspace);
        if (!event.isDefaultPrevented()) {
            var input = getInput();
            var value = input.val();
            changeInputValue(value.substr(0, value.length - 1));
        }
    }

    function changeInputValue(value) {
        changeElementValue(getInput(), value);
    }
});
