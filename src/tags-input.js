/**
 * @ngdoc directive
 * @name tagsInput
 * @module ngTagsInput
 *
 * @description
 * Renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable Angular expression to data-bind to.
 * @param {boolean=} [useStrings=false] Flag indicating that the model is an array of strings (EXPERIMENTAL).
 * @param {string=} [template=NA] URL or id of a custom template for rendering each tag.
 * @param {string=} [templateScope=NA] Scope to be passed to custom templates - of both tagsInput and
 *    autoComplete directives - as $scope.
 * @param {string=} [displayProperty=text] Property to be rendered as the tag label.
 * @param {string=} [keyProperty=text] Property to be used as a unique identifier for the tag.
 * @param {string=} [type=text] Type of the input element. Only 'text', 'email' and 'url' are supported values.
 * @param {string=} [text=NA] Assignable Angular expression for data-binding to the element's text.
 * @param {number=} tabindex Tab order of the control.
 * @param {string=} [placeholder=Add a tag] Placeholder text for the control.
 * @param {number=} [minLength=3] Minimum length for a new tag.
 * @param {number=} [maxLength=MAX_SAFE_INTEGER] Maximum length allowed for a new tag.
 * @param {number=} [minTags=0] Sets minTags validation error key if the number of tags added is less than minTags.
 * @param {number=} [maxTags=MAX_SAFE_INTEGER] Sets maxTags validation error key if the number of tags added is greater
 *    than maxTags.
 * @param {boolean=} [allowLeftoverText=false] Sets leftoverText validation error key if there is any leftover text in
 *    the input element when the directive loses focus.
 * @param {string=} [removeTagSymbol=×] (Obsolete) Symbol character for the remove tag button.
 * @param {boolean=} [addOnEnter=true] Flag indicating that a new tag will be added on pressing the ENTER key.
 * @param {boolean=} [addOnSpace=false] Flag indicating that a new tag will be added on pressing the SPACE key.
 * @param {boolean=} [addOnComma=true] Flag indicating that a new tag will be added on pressing the COMMA key.
 * @param {boolean=} [addOnBlur=true] Flag indicating that a new tag will be added when the input field loses focus.
 * @param {boolean=} [addOnPaste=false] Flag indicating that the text pasted into the input field will be split into tags.
 * @param {string=} [pasteSplitPattern=,] Regular expression used to split the pasted text into tags.
 * @param {boolean=} [replaceSpacesWithDashes=true] Flag indicating that spaces will be replaced with dashes.
 * @param {string=} [allowedTagsPattern=.+] Regular expression that determines whether a new tag is valid.
 * @param {boolean=} [enableEditingLastTag=false] Flag indicating that the last tag will be moved back into the new tag
 *    input box instead of being removed when the backspace key is pressed and the input box is empty.
 * @param {boolean=} [addFromAutocompleteOnly=false] Flag indicating that only tags coming from the autocomplete list
 *    will be allowed. When this flag is true, addOnEnter, addOnComma, addOnSpace and addOnBlur values are ignored.
 * @param {boolean=} [spellcheck=true] Flag indicating whether the browser's spellcheck is enabled for the input field or not.
 * @param {expression=} [tagClass=NA] Expression to evaluate for each existing tag in order to get the CSS classes to be used.
 *    The expression is provided with the current tag as $tag, its index as $index and its state as $selected. The result
 *    of the evaluation must be one of the values supported by the ngClass directive (either a string, an array or an object).
 *    See https://docs.angularjs.org/api/ng/directive/ngClass for more information.
 * @param {expression=} [onTagAdding=NA] Expression to evaluate that will be invoked before adding a new tag. The new
 *    tag is available as $tag. This method must return either a boolean value or a promise. If either a false value or a rejected
 *    promise is returned, the tag will not be added.
 * @param {expression=} [onTagAdded=NA] Expression to evaluate upon adding a new tag. The new tag is available as $tag.
 * @param {expression=} [onInvalidTag=NA] Expression to evaluate when a tag is invalid. The invalid tag is available as $tag.
 * @param {expression=} [onTagRemoving=NA] Expression to evaluate that will be invoked before removing a tag. The tag
 *    is available as $tag. This method must return either a boolean value or a promise. If either a false value or a rejected
 *    promise is returned, the tag will not be removed.
 * @param {expression=} [onTagRemoved=NA] Expression to evaluate upon removing an existing tag. The removed tag is available as $tag.
 * @param {expression=} [onTagClicked=NA] Expression to evaluate upon clicking an existing tag. The clicked tag is available as $tag.
 * @param {boolean=} [dragtag=false] Whether or not the labels can be dragged to be ordered differently
 * @param {expression=} [onTagDragged=NA] Expression to evaluate upon a dropping a dragged tag. The clicked tag is available as $tag.
 */
export default function TagsInputDirective($timeout, $document, $window, $q, tagsInputConfig, tiUtil, tiConstants) {
  'ngInject';

  function TagList(options, events, onTagAdding, onTagRemoving) {
    let self = {};

    let getTagText = tag =>tiUtil.safeToString(tag[options.displayProperty]);
    let setTagText = (tag, text) => {
      tag[options.displayProperty] = text;
    };

    let canAddTag = tag => {
      let tagText = getTagText(tag);
      let valid = tagText &&
                  tagText.length >= options.minLength &&
                  tagText.length <= options.maxLength &&
                  options.allowedTagsPattern.test(tagText) &&
                  !tiUtil.findInObjectArray(self.items, tag, options.keyProperty || options.displayProperty);

      return $q.when(valid && onTagAdding({ $tag: tag })).then(tiUtil.promisifyValue);
    };

    let canRemoveTag = tag => $q.when(onTagRemoving({ $tag: tag })).then(tiUtil.promisifyValue);

    self.items = [];

    self.addText = text => {
      let tag = {};
      setTagText(tag, text);
      return self.add(tag);
    };

    self.add = tag => {
      let tagText = getTagText(tag);

      if (options.replaceSpacesWithDashes) {
        tagText = tiUtil.replaceSpacesWithDashes(tagText);
      }

      setTagText(tag, tagText);

      return canAddTag(tag)
        .then(() =>{
          self.items.push(tag);
          events.trigger('tag-added', { $tag: tag });
        })
        .catch(() => {
          if (tagText) {
            events.trigger('invalid-tag', { $tag: tag });
          }
        });
    };

    self.remove = index => {
      let tag = self.items[index];
      return canRemoveTag(tag).then(() => {
        self.items.splice(index, 1);
        self.clearSelection();
        events.trigger('tag-removed', { $tag: tag });
        return tag;
      });
    };
    
    self.reorder = (prevOffset, newOffset) => {
      if(prevOffset<0 || newOffset<0 || prevOffset > self.items.length || newOffset > self.items.length || prevOffset==newOffset) return;
      self.items.splice(newOffset, 0, self.items.splice(prevOffset, 1)[0]);
      self.clearSelection();
      events.trigger('tag-dragged');
    };

    self.select = index => {
      if (index < 0) {
        index = self.items.length - 1;
      }
      else if (index >= self.items.length) {
        index = 0;
      }

      self.index = index;
      self.selected = self.items[index];
    };

    self.selectPrior = () => {
      self.select(--self.index);
    };

    self.selectNext = () => {
      self.select(++self.index);
    };

    self.removeSelected = () => self.remove(self.index);

    self.clearSelection = () => {
      self.selected = null;
      self.index = -1;
    };

    self.getItems = () => options.useStrings ? self.items.map(getTagText) : self.items;

    self.clearSelection();

    return self;
  }

  function validateType(type) {
    return tiConstants.SUPPORTED_INPUT_TYPES.indexOf(type) !== -1;
  }

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      tags: '=ngModel',
      text: '=?',
      templateScope: '=?',
      tagClass: '&',
      onTagAdding: '&',
      onTagAdded: '&',
      onInvalidTag: '&',
      onTagRemoving: '&',
      onTagRemoved: '&',
      onTagClicked: '&',
      onTagDragged: '&'
    },
    replace: false,
    transclude: true,
    templateUrl: 'ngTagsInput/tags-input.html',
    controller($scope, $element, $attrs) {
      'ngInject';

      $scope.events = tiUtil.simplePubSub();

      $scope.options = tagsInputConfig.load('tagsInput', $element, $attrs, $scope.events, {
        template: [String, 'ngTagsInput/tag-item.html'],
        type: [String, 'text', validateType],
        placeholder: [String, 'Add a tag'],
        tabindex: [Number, null],
        removeTagSymbol: [String, String.fromCharCode(215)],
        replaceSpacesWithDashes: [Boolean, true],
        minLength: [Number, 3],
        maxLength: [Number, tiConstants.MAX_SAFE_INTEGER],
        addOnEnter: [Boolean, true],
        addOnSpace: [Boolean, false],
        addOnComma: [Boolean, true],
        addOnBlur: [Boolean, true],
        addOnPaste: [Boolean, false],
        pasteSplitPattern: [RegExp, /,/],
        allowedTagsPattern: [RegExp, /.+/],
        enableEditingLastTag: [Boolean, false],
        minTags: [Number, 0],
        maxTags: [Number, tiConstants.MAX_SAFE_INTEGER],
        displayProperty: [String, 'text'],
        keyProperty: [String, ''],
        allowLeftoverText: [Boolean, false],
        addFromAutocompleteOnly: [Boolean, false],
        spellcheck: [Boolean, true],
        useStrings: [Boolean, false],
        dragtag: [Boolean, false]
      });

      $scope.tagList = new TagList($scope.options, $scope.events,
        tiUtil.handleUndefinedResult($scope.onTagAdding, true),
        tiUtil.handleUndefinedResult($scope.onTagRemoving, true));

      this.registerAutocomplete = () => ({
        addTag: function(tag) {
          return $scope.tagList.add(tag);
        },
        getTags: function() {
          return $scope.tagList.items;
        },
        getCurrentTagText: function() {
          return $scope.newTag.text();
        },
        getOptions: function() {
          return $scope.options;
        },
        getTemplateScope: function() {
          return $scope.templateScope;
        },
        on: function(name, handler) {
          $scope.events.on(name, handler, true);
          return this;
        }
      });

      this.registerTagItem = () => ({
        getOptions: function () {
          return $scope.options;
        },
        removeTag: function (index) {
          if ($scope.disabled) {
            return;
          }
          $scope.tagList.remove(index);
        }
      });
    },
    link(scope, element, attrs, ngModelCtrl) {
      let hotkeys = [tiConstants.KEYS.enter, tiConstants.KEYS.comma, tiConstants.KEYS.space, tiConstants.KEYS.backspace,
        tiConstants.KEYS.delete, tiConstants.KEYS.left, tiConstants.KEYS.right];
      let tagList = scope.tagList;
      let events = scope.events;
      let options = scope.options;
      let input = element.find('input');
      let validationOptions = ['minTags', 'maxTags', 'allowLeftoverText'];

      let setElementValidity = () => {
        ngModelCtrl.$setValidity('maxTags', tagList.items.length <= options.maxTags);
        ngModelCtrl.$setValidity('minTags', tagList.items.length >= options.minTags);
        ngModelCtrl.$setValidity('leftoverText', scope.hasFocus || options.allowLeftoverText ? true : !scope.newTag.text());
      };

      let focusInput = () => {
        $timeout(() => { input[0].focus(); });
      };

      ngModelCtrl.$isEmpty = value => !value || !value.length;

      scope.newTag = {
        text(value) {
          if (angular.isDefined(value)) {
            scope.text = value;
            events.trigger('input-change', value);
          }
          else {
            return scope.text || '';
          }
        },
        invalid: null
      };

      scope.track = tag => tag[options.keyProperty || options.displayProperty];

      scope.getTagClass = (tag, index) => {
        let selected = tag === tagList.selected;
        var ret = [
          scope.tagClass({$tag: tag, $index: index, $selected: selected}),
                    { selected: selected }
        ];
        if(options.dragtag)ret.push('tag-item-dragtag')
        return ret;
      };

      scope.$watch('tags', value => {
        if (value) {
          tagList.items = tiUtil.makeObjectArray(value, options.displayProperty);
          if (options.useStrings) {
            return;
          }

          scope.tags = tagList.items;
        }
        else {
          tagList.items = [];
        }
      });

      scope.$watch('tags.length', () => {
        setElementValidity();

        // ngModelController won't trigger validators when the model changes (because it's an array),
        // so we need to do it ourselves. Unfortunately this won't trigger any registered formatter.
        ngModelCtrl.$validate();
      });

      attrs.$observe('disabled', value => {
        scope.disabled = value;
      });

      scope.eventHandlers = {
        input: {
          keydown($event) {
            events.trigger('input-keydown', $event);
          },
          focus() {
            if (scope.hasFocus) {
              return;
            }

            scope.hasFocus = true;
            events.trigger('input-focus');
          },
          blur() {
            $timeout(() => {
              let activeElement = $document.prop('activeElement');
              let lostFocusToBrowserWindow = activeElement === input[0];
              let lostFocusToChildElement = element[0].contains(activeElement);

              if (lostFocusToBrowserWindow || !lostFocusToChildElement) {
                scope.hasFocus = false;
                events.trigger('input-blur');
              }
            });
          },
          paste($event) {
            $event.getTextData = () => {
              let clipboardData = $event.clipboardData || ($event.originalEvent && $event.originalEvent.clipboardData);
              return clipboardData ? clipboardData.getData('text/plain') : $window.clipboardData.getData('Text');
            };
            events.trigger('input-paste', $event);
          }
        },
        host: {
          click() {
            if (scope.disabled) {
              return;
            }
            focusInput();
          },
          mousemove(event){
            if(options.dragtag && scope.draggedElement){
              var zoomFactor =  window.innerWidth / window.outerWidth//accounting for browser zoom in/out
              scope.draggedElement.elem.style.left=zoomFactor*(event.screenX - scope.draggedElement.x)+'px';
              scope.draggedElement.elem.style.top=zoomFactor*(event.screenY - scope.draggedElement.y)+'px';
            }
          }
        },
        tag: {
          click(tag) {
            events.trigger('tag-clicked', { $tag: tag });
          },
          mousedown(event){
            if(options.dragtag){
              var target = event.target || event.srcElement || event.currentTarget;
              if(target.tagName=='A')return;//if you hit the A, don't do this 
              while(target.tagName!='LI')target = target.parentElement  //go up parents until you find the LI
              target.style.position='relative';
              scope.draggedElement = {'elem':target,'x':event.screenX,'y':event.screenY}
              
              //console.log('pick up element at '+scope.draggedElement.x+" "+scope.draggedElement.y)
    
              event.preventDefault();
              event.stopImmediatePropagation();
            }
          },
          mouseup(event){
            if(options.dragtag && scope.draggedElement){
              //console.log('put down element at '+event.screenX+" "+event.screenY)
              
              var listHolder = scope.draggedElement.elem.parentElement
              var allElems = listHolder.getElementsByTagName("LI")
              var prevOffset = -1;
              var newOffset = -1;
 
               //find elem's offset
              for(var i=0;i<allElems.length;i++){
                if(allElems[i].style.position=='relative')
                  prevOffset = i;
              }
                             
              
              //which coordinate do you want to consider for elem? top left? center? mouse position?  .... this does the midpoint
              var elem_x =  scope.draggedElement.elem.offsetLeft + scope.draggedElement.elem.offsetWidth/2
              var elem_y =  scope.draggedElement.elem.offsetTop + scope.draggedElement.elem.offsetHeight/2
              
              for(var i=0;i<allElems.length;i++){
                if(i==prevOffset)continue;//don't consider yourself
                
                var x_lo = allElems[i].offsetLeft
                var x_hi = allElems[i].offsetLeft + allElems[i].offsetWidth
                var y_lo = allElems[i].offsetTop
                var y_hi = allElems[i].offsetTop + allElems[i].offsetHeight
                
                //it's the end of the list OR the next one's upper bound is greater than current low bound
                var end_of_line = i==allElems.length-1 || allElems[i+1].offsetTop > y_hi
                
                //option 1: elem's position is inside the bounding box of this considered element
                if(x_lo <= elem_x && elem_x <= x_hi && y_lo <= elem_y && elem_y <= y_hi ){
                  newOffset=i;
                  break;
                }
                
                //option 2: elem's y is within bounding box AND x is greater AND it's end of the line
                if( y_lo <= elem_y && elem_y <= y_hi   && elem_x > x_hi && end_of_line){
                  newOffset=i;
                  break;
                }
                
                //option 3: the last line is empty, and you drop it there, so it has to consider the last element, and elem_y is higher than the y val
                if(i==allElems.length-1 && elem_y > y_hi){
                  newOffset=i;
                  break;
                }
                
                //option 4: you drop it to the left of a guy that's on the beginning of the line
                if((i==0 || allElems[i-1].offsetTop < y_lo) && y_lo < elem_y && elem_y <y_hi && elem_x < x_lo){
                  newOffset=i;
                  break;
                }
              }
              
              if(prevOffset!=-1 && newOffset!=-1 && newOffset!=prevOffset){
                //console.log('moving:'+prevOffset+" to:"+newOffset)
                tagList.reorder(prevOffset,newOffset);
              }
              
              //undo the "temp" stuff to be ready for the next one ...
              scope.draggedElement.elem.style.position='static'
              scope.draggedElement = null
            }
          }
        }
      };

      events
        .on('tag-added', scope.onTagAdded)
        .on('invalid-tag', scope.onInvalidTag)
        .on('tag-removed', scope.onTagRemoved)
        .on('tag-clicked', scope.onTagClicked)
        .on('tag-added', () => {
          scope.newTag.text('');
        })
        .on('tag-added tag-removed', () => {
          scope.tags = tagList.getItems();
          // Ideally we should be able call $setViewValue here and let it in turn call $setDirty and $validate
          // automatically, but since the model is an array, $setViewValue does nothing and it's up to us to do it.
          // Unfortunately this won't trigger any registered $parser and there's no safe way to do it.
          ngModelCtrl.$setDirty();
          focusInput();
        })
        .on('invalid-tag', () => {
          scope.newTag.invalid = true;
        })
        .on('option-change', e => {
          if (validationOptions.indexOf(e.name) !== -1) {
            setElementValidity();
          }
        })
        .on('input-change', () => {
          tagList.clearSelection();
          scope.newTag.invalid = null;
        })
        .on('input-focus', () => {
          element.triggerHandler('focus');
          ngModelCtrl.$setValidity('leftoverText', true);
        })
        .on('input-blur', () => {
          if (options.addOnBlur && !options.addFromAutocompleteOnly) {
            tagList.addText(scope.newTag.text());
          }
          element.triggerHandler('blur');
          setElementValidity();
        })
        .on('input-keydown', event => {
          let key = event.keyCode;

          if (tiUtil.isModifierOn(event) || hotkeys.indexOf(key) === -1) {
            return;
          }

          let addKeys = {
            [tiConstants.KEYS.enter]: options.addOnEnter,
            [tiConstants.KEYS.comma]: options.addOnComma,
            [tiConstants.KEYS.space]: options.addOnSpace
          };

          let shouldAdd = !options.addFromAutocompleteOnly && addKeys[key];
          let shouldRemove = (key === tiConstants.KEYS.backspace || key === tiConstants.KEYS.delete) && tagList.selected;
          let shouldEditLastTag = key === tiConstants.KEYS.backspace && scope.newTag.text().length === 0 && options.enableEditingLastTag;
          let shouldSelect = (key === tiConstants.KEYS.backspace || key === tiConstants.KEYS.left || key === tiConstants.KEYS.right) &&
            scope.newTag.text().length === 0 && !options.enableEditingLastTag;

          if (shouldAdd) {
            tagList.addText(scope.newTag.text());
          }
          else if (shouldEditLastTag) {
            tagList.selectPrior();
            tagList.removeSelected().then(tag => {
              if (tag) {
                scope.newTag.text(tag[options.displayProperty]);
              }
            });
          }
          else if (shouldRemove) {
            tagList.removeSelected();
          }
          else if (shouldSelect) {
            if (key === tiConstants.KEYS.left || key === tiConstants.KEYS.backspace) {
              tagList.selectPrior();
            }
            else if (key === tiConstants.KEYS.right) {
              tagList.selectNext();
            }
          }

          if (shouldAdd || shouldSelect || shouldRemove || shouldEditLastTag) {
            event.preventDefault();
          }
        })
        .on('input-paste', event => {
          if (options.addOnPaste) {
            let data = event.getTextData();
            let tags = data.split(options.pasteSplitPattern);

            if (tags.length > 1) {
              tags.forEach(tag => {
                tagList.addText(tag);
              });
              event.preventDefault();
            }
          }
        });
    }
  };
}
