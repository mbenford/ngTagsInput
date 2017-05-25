import * as angular from 'angular';
import Constants from './constants';
import TagsInputDirective from './tags-input';
import TagItemDirective from './tag-item';
import AutocompleteDirective from './auto-complete';
import AutocompleteMatchDirective from './auto-complete-match';
import AutosizeDirective from './autosize';
import BindAttributesDirective from './bind-attrs';
import SelectallDirective from './selectall';
import TranscludeAppendDirective from './transclude-append';
import TagsInputConfigurationProvider from './configuration';
import UtilService from './util';
import TemplateCacheRegister from 'compiled-templates';

angular.module('ngTagsInput', [])
    .directive('tagsInput', TagsInputDirective)
    .directive('tiTagItem', TagItemDirective)
    .directive('autoComplete', AutocompleteDirective)
    .directive('tiAutocompleteMatch', AutocompleteMatchDirective)
    .directive('tiAutosize', AutosizeDirective)
    .directive('tiBindAttrs', BindAttributesDirective)
    .directive('tiTranscludeAppend', TranscludeAppendDirective)
    .directive('tiSelectall', SelectallDirective)
    .factory('tiUtil', UtilService)
    .constant('tiConstants', Constants)
    .provider('tagsInputConfig', TagsInputConfigurationProvider)
    .run(TemplateCacheRegister);