## 2.3.0 (2015-03-23)

#### Bug Fixes

* **autocomplete:**
  * Make match highlighting case insensitive ([42ca7e46](https://github.com/mbenford/ngTagsInput/commit/42ca7e46ea37d5dd213a62bbb0706b2073f592de), [#388](https://github.com/mbenford/ngTagsInput/issues/388))
  * Make a copy of the suggestion before adding ([b12f5074](https://github.com/mbenford/ngTagsInput/commit/b12f50744e0b60371c134bbec3a54d2a474bfacd))
  * Fix existing tags diff algorithm ([913e95a2](https://github.com/mbenford/ngTagsInput/commit/913e95a2caf6c21736650798d6d1cb25f6619f2f), [#232](https://github.com/mbenford/ngTagsInput/issues/232))
* **tagsInput:**
  * Fix addOnPaste issue with jQuery ([664dfc70](https://github.com/mbenford/ngTagsInput/commit/664dfc70942ece06b0b97d85cbc52d1954398696))
  * Fix add-on-paste issue in IE ([e752682d](https://github.com/mbenford/ngTagsInput/commit/e752682d067cf48a2969820fb4f383bcbf807fa9), [#325](https://github.com/mbenford/ngTagsInput/issues/325))
  * Ensure autocomplete attribute is off ([8359e608](https://github.com/mbenford/ngTagsInput/commit/8359e608e2cf1c83e61828f456081f5a33f374ab), [#368](https://github.com/mbenford/ngTagsInput/issues/368))
  * Fix element validity on tag removal ([0bfc7ee3](https://github.com/mbenford/ngTagsInput/commit/0bfc7ee3f40399fee5e8dfa6562dbbc3574cdbf1), [#381](https://github.com/mbenford/ngTagsInput/issues/381))

#### Features

* **autocomplete:**
  * Add custom template support ([b550b119](https://github.com/mbenford/ngTagsInput/commit/b550b1190509e399742f32abb6299c179fe7bae1), [#99](https://github.com/mbenford/ngTagsInput/issues/99))
  * Make $index available to custom templates ([8611877e](https://github.com/mbenford/ngTagsInput/commit/8611877ef43581fe493fd3195726f027af2ae3cc))
  * Add autoscroll support ([13796600](https://github.com/mbenford/ngTagsInput/commit/13796600cb81d0ef111c5c55ac76d98bf0832fa9), [#216](https://github.com/mbenford/ngTagsInput/issues/216))
* **tagsInput:**
  * Add custom template support ([45e5d998](https://github.com/mbenford/ngTagsInput/commit/45e5d99809f66ea52e2206a476eb546867bbe4a8))
  * Add ng-required support ([8f17b9f1](https://github.com/mbenford/ngTagsInput/commit/8f17b9f11bd359fe0066133af8b93914611150ea), [#157](https://github.com/mbenford/ngTagsInput/issues/157))
  * Add support for tag navigation ([18760b24](https://github.com/mbenford/ngTagsInput/commit/18760b249978203bd4aaa798aa07b72199c73aed), [#350](https://github.com/mbenford/ngTagsInput/issues/350))
  * Add ng-disabled support ([870caba6](https://github.com/mbenford/ngTagsInput/commit/870caba653c4874b952b65893e4de07cf605d2b8), [#102](https://github.com/mbenford/ngTagsInput/issues/102))
  * Add keyProperty and displayProperty options ([2c780f9a](https://github.com/mbenford/ngTagsInput/commit/2c780f9a53711317f75a7141c6965f1568b9daae), [#265](https://github.com/mbenford/ngTagsInput/issues/265))
  * Add onTagAdding/onTagRemoving callbacks ([c4ceed54](https://github.com/mbenford/ngTagsInput/commit/c4ceed546b30cb6f2052de6b5edcf0f759803ef7), [#100](https://github.com/mbenford/ngTagsInput/issues/100))

## 2.2.0 (2015-03-02)

#### Bug Fixes

* **autocomplete:**
  * Fix loadOnEmpty behavior ([c63eb05e](https://github.com/mbenford/ngTagsInput/commit/c63eb05e2e78698299eed1537995ea149c9a5b6a), [#205](https://github.com/mbenford/ngTagsInput/issues/205))
  * Correctly highlight HTML entities ([315f3a2b](https://github.com/mbenford/ngTagsInput/commit/315f3a2b0f9a34a98a203162d452a3c7520bb6f4), [#200](https://github.com/mbenford/ngTagsInput/issues/200))
* **tagsInput:**
  * Add spellcheck option ([166f8358](https://github.com/mbenford/ngTagsInput/commit/166f8358ce1f8c42b54390d3b52a71f5803c1e5a))
  * Ignore addFromAutocompleteOnly on input-blur ([e4767c2d](https://github.com/mbenford/ngTagsInput/commit/e4767c2da75ee8d197c804f15620d107495a91a4))

#### Features

* **autocomplete:** 
 * Add autoSelectFirstSuggestion option ([0993bbdf](https://github.com/mbenford/ngTagsInput/commit/0993bbdf5ac85f0af5e62c5fa76c13a2aecfa0c7), [#136](https://github.com/mbenford/ngTagsInput/issues/136))
  * Remove requirement for the source option to return a promise ([10932fbb](https://github.com/mbenford/ngTagsInput/commit/10932fbb18b0887927ae71bb1f9e1d1d0f0f4e26), [#237](https://github.com/mbenford/ngTagsInput/issues/237))
* **tagsInput:**
  * Add addOnPaste and pasteSplitPattern options ([9ad32fbd](https://github.com/mbenford/ngTagsInput/commit/9ad32fbd5c3f1d7237bccd73c44796c0eaa91e0d))
  * Add onInvalidTag option ([e5c57b8e](https://github.com/mbenford/ngTagsInput/commit/e5c57b8ec77b4840e6f383e0bee9a0ce2f6ff0dc))
  * Enable ngFocus and ngBlur native directives ([210b86f7](https://github.com/mbenford/ngTagsInput/commit/210b86f74538564adcabd0ab22522866888acad8))

## 2.1.1 (2014-09-04)

#### Bug Fixes

* **tagsInput:** Fix has-success, has-warning and has-error classes ([2a098736](https://github.com/mbenford/ngTagsInput/commit/2a0987367db2d28106936fa39393964e35b61de7))

## 2.1.0 (2014-08-22)

#### Bug Fixes

* **autocomplete:** Fix suggestion selection on touch devices ([ef25a555](https://github.com/mbenford/ngTagsInput/commit/ef25a5555f358e9986635826788c2475c9f417ee))
* **tagsInput:**
  * Prevent an empty tag from being added ([c104c2b2](https://github.com/mbenford/ngTagsInput/commit/c104c2b2cdd19fe891c76e4a2b1f20d13e27369f), [#172](https://github.com/mbenford/ngTagsInput/issues/172))
  * Set element's validity when options change ([e89f2682](https://github.com/mbenford/ngTagsInput/commit/e89f268218d75f23c6c14c426b7b7c7686fd8898), [#154](https://github.com/mbenford/ngTagsInput/issues/154))
  * Replace interpolation with ngBind ([cadf8327](https://github.com/mbenford/ngTagsInput/commit/cadf83279c194b0135a5b5960987028c91c04e74))
  * Remove dependency on interpolation symbols ([6598b556](https://github.com/mbenford/ngTagsInput/commit/6598b5562169c506e7645acbdac360e8d20c1054), [#151](https://github.com/mbenford/ngTagsInput/issues/151))
  * Fix display of non-string items ([49734921](https://github.com/mbenford/ngTagsInput/commit/497349211ff17505208268fade98ed93e13fa082), [#150](https://github.com/mbenford/ngTagsInput/issues/150))

#### Features

* **autocomplete:**
  * Add loadOnFocus option ([fe711f56](https://github.com/mbenford/ngTagsInput/commit/fe711f56eaa3fe4293527955e653b3f6bbd235a0))
  * Add loadOnEmpty option ([28c615fa](https://github.com/mbenford/ngTagsInput/commit/28c615fa543cdcfa79107e3d9bddfdb73f85c87a))
  * Add loadOnDownArrow option ([c44f110a](https://github.com/mbenford/ngTagsInput/commit/c44f110a539fe44f2255d51ee7e011b3d84bc38a), [#54](https://github.com/mbenford/ngTagsInput/issues/54))
* **configuration:**
  * Add setTextAutosizeThreshold method ([a1702e63](https://github.com/mbenford/ngTagsInput/commit/a1702e636128c8ec7fd14c9f0e7a235157696986), [#181](https://github.com/mbenford/ngTagsInput/issues/181))
  * Add support for validation ([445877a1](https://github.com/mbenford/ngTagsInput/commit/445877a1325c31708f9bf7ea6a85e51647ce6a94))
* **tagsInput:**
  * Add support for some Bootstrap classes ([d6360655](https://github.com/mbenford/ngTagsInput/commit/d6360655d7444e4979ccfb6092f79ba0a82edfc6), [#78](https://github.com/mbenford/ngTagsInput/issues/78))
  * Add type option ([3afe564d](https://github.com/mbenford/ngTagsInput/commit/3afe564d4be4f5726638132bb6329a259c9422fd), [#140](https://github.com/mbenford/ngTagsInput/issues/140))

## v2.0.1 (2014-04-13)

#### Bug Fixes

* **autocomplete:**
  * Escape regex metachars when highlighting ([e3c695f2](https://github.com/mbenford/ngTagsInput/commit/e3c695f26f96ab642a4a1f1129638e763b84b231), [#124](https://github.com/mbenford/ngTagsInput/issues/124))
  * Fix autocomplete navigation when maxResultsToShow is set ([d95d35e8](https://github.com/mbenford/ngTagsInput/commit/d95d35e814099d74355ed431e85a957d39ec4745), [#109](https://github.com/mbenford/ngTagsInput/issues/109))
  * Fix memory leak ([ba3a1a56](https://github.com/mbenford/ngTagsInput/commit/ba3a1a563d99894f381e4a29f3a1753a540ff453), [#118](https://github.com/mbenford/ngTagsInput/issues/118))
* **autosize:** Re-size input when placeholder changes ([0eacc964](https://github.com/mbenford/ngTagsInput/commit/0eacc9647ed7b12fac8db23cb711bb6c38a8c31a), [#110](https://github.com/mbenford/ngTagsInput/issues/110))

## v2.0.0 (2014-03-26)

#### Bug Fixes

* **tagsInput:**
  * Fix blur handling ([f4fe7b87](https://github.com/mbenford/ngTagsInput/commit/f4fe7b87985e123d688595cd14aa22d549143de6), [#91](https://github.com/mbenford/ngTagsInput/issues/91))
  * Fix autosize directive ([e9a723c9](https://github.com/mbenford/ngTagsInput/commit/e9a723c911a8d32964ad771c333f09fc78157172), [#84](https://github.com/mbenford/ngTagsInput/issues/84)) ([12b5beba](https://github.com/mbenford/ngTagsInput/commit/12b5beba230304fd22b6fef8eb613f6133860c0a), [#75](https://github.com/mbenford/ngTagsInput/issues/75))

#### Features

* **tagsInput:**
  * Add addFromAutocompleteOnly option ([90f075c9](https://github.com/mbenford/ngTagsInput/commit/90f075c991866b99bd830529913483ea5e32a63f), [#60](https://github.com/mbenford/ngTagsInput/issues/60))
  * Make maxLength consistent with minLength ([1458ba62](https://github.com/mbenford/ngTagsInput/commit/1458ba624a876a25ac0d8776388ecf4a16cc6aa7), [#53](https://github.com/mbenford/ngTagsInput/issues/53))
  * Add visual feedback for invalid tags ([f469c274](https://github.com/mbenford/ngTagsInput/commit/f469c274b09397ca88004da78670dc090bf693e0), [#77](https://github.com/mbenford/ngTagsInput/issues/77))
  * Change allowedTagsPattern's default value ([87029090](https://github.com/mbenford/ngTagsInput/commit/8702909009f998114765b6673c565dda4b038b43), [#76](https://github.com/mbenford/ngTagsInput/issues/76))
  * Add support for validation CSS classes ([7f9e8bba](https://github.com/mbenford/ngTagsInput/commit/7f9e8bba7defca2c0f7c75b933b2e9c336f72b47), [#55](https://github.com/mbenford/ngTagsInput/issues/55))
  * Add support for array of objects ([5c036806](https://github.com/mbenford/ngTagsInput/commit/5c036806a41d425e194d0496d9f091fb927b42c3), [#46](https://github.com/mbenford/ngTagsInput/issues/46))
* **configProvider:** Make options optionally data-bound ([390380bf](https://github.com/mbenford/ngTagsInput/commit/390380bffd4cac03ca71cb780e20898b2a6b07ad), [#73](https://github.com/mbenford/ngTagsInput/issues/73))

#### Breaking Changes

* Stylesheets were changed and .ngTagsInput class selector was replaced by tags-input type selector. ([7f9e8bba](https://github.com/mbenford/ngTagsInput/commit/7f9e8bba7defca2c0f7c75b933b2e9c336f72b47))
* From now on, arrays of strings are no longer supported. In order to keep some backward compatibility a one-time conversion from an array of strings into an array of objects is available. ([5c036806](https://github.com/mbenford/ngTagsInput/commit/5c036806a41d425e194d0496d9f091fb927b42c3))

## v1.1.1 (2014-01-23)

#### Bug Fixes

* **tagsInput:** Fix input-change event name ([47b40e13](http://github.com/mbenford/ngTagsInput/commit/47b40e1394bb3dfe7eabaf932a77d92539fb065e), [#57](http://github.com/mbenford/ngTagsInput/issues/57))

## v1.1.0 (2014-01-14)

#### Bug Fixes

* **tagsInput:** 
  * Change input width accordingly to its content ([8abdf79b](http://github.com/mbenford/ngTagsInput/commit/8abdf79bcd6871cd7c7064838020ea2b6c7b2fa2), [#6](http://github.com/mbenford/ngTagsInput/issues/6))
* **autocomplete:**
  * Fix require property ([231f275c](http://github.com/mbenford/ngTagsInput/commit/231f275c9f254370cb821648f71860a51e67a935))
  * Close suggestion list when input loses focus ([d73d1567](http://github.com/mbenford/ngTagsInput/commit/d73d1567f3e01e45096ae50ca34b01424841214c), [#52](http://github.com/mbenford/ngTagsInput/issues/52))
  * Hide suggestion list when there's nothing to show ([5a58a927](http://github.com/mbenford/ngTagsInput/commit/5a58a9274d38d8914a107c0108e6f2e4b1fd62e8), [#39](http://github.com/mbenford/ngTagsInput/issues/39))

#### Features

* **tagsInput:**
  * Add support for ngModelController ([49c07608](http://github.com/mbenford/ngTagsInput/commit/49c076089b93f41decf751b662437a29fa28c7ea), [#45](http://github.com/mbenford/ngTagsInput/issues/45))
  * Add min-tags option ([49c07608](http://github.com/mbenford/ngTagsInput/commit/49c076089b93f41decf751b662437a29fa28c7ea), [#47](http://github.com/mbenford/ngTagsInput/issues/47))
  * Add max-tags option ([2bc02ec9](http://github.com/mbenford/ngTagsInput/commit/2bc02ec9f9c04fab5ef715efbc40914f7301fc22), [#24](http://github.com/mbenford/ngTagsInput/issues/24))
* **autocomplete:** 
  * Add support for $http promises ([adaf6580](http://github.com/mbenford/ngTagsInput/commit/adaf6580320a47b962cb769407ae19abd8e6317c), [#38](http://github.com/mbenford/ngTagsInput/issues/38))
* **configProvider:** 
  * Add support for global configuration ([e48be112](http://github.com/mbenford/ngTagsInput/commit/e48be112b65ca5bbf9513fdaa4618bb949ae7640), [#48](http://github.com/mbenford/ngTagsInput/issues/48))

#### Breaking Changes

* Some CSS selectors must be changed, and therefore custom stylesheets based on the old selectors will conflict with this fix. They'll have to be updated to use class selectors.  ([8abdf79b](http://github.com/mbenford/ngTagsInput/commit/8abdf79bcd6871cd7c7064838020ea2b6c7b2fa2), [#6](http://github.com/mbenford/ngTagsInput/issues/6))

## v1.0.1 (2013-12-16)

- **tagsInput**
    - Ignore modifier keys when processing keystrokes ([820014e][], [#35][])
- **autocomplete**
    - Encode HTML chars in suggestion list ([6e4f7c7][], [#34][])
    - Prevent pending promises from executing ([710d33a][], [#36][])
    
[820014e]: https://github.com/mbenford/ngTagsInput/commit/820014e
[710d33a]: https://github.com/mbenford/ngTagsInput/commit/710d33a
[6e4f7c7]: https://github.com/mbenford/ngTagsInput/commit/6e4f7c7
[#34]: https://github.com/mbenford/ngTagsInput/issues/34
[#35]: https://github.com/mbenford/ngTagsInput/issues/35
[#36]: https://github.com/mbenford/ngTagsInput/issues/36

## v1.0.0 (2013-12-07)

- **tagsInput**
    - Added support for Angular 1.2 ([1a0b256][], [#17][])
    - Added addOnBlur option ([69415a2][], [#29][])
    - Fixed focus outline ([7d3c51a][], [#32][])
    - Renamed ng-class option as custom-class ([298bf11][])
    - Renamed tags-input module as ngTagsInput ([1db08aa][])
- **autocomplete**
    - Added debounce-delay option ([1a6527f][], [#19][])
    - Added min-length option ([c17d7a4][], [#21][])
    - Added match highlighting ([ce73779][], [#22][])
    - Added maxResultsToShow option ([b2ae61b][], [#23][])
    - Added tag filtering support ([a27363d][], [#25][])
    - Changed tag addition behavior ([4f868e0][], [#30][])
    - Fixed suggestions box visibility ([84bb916][], [c2b43c6][], [#26][])
    - Changed source option to comply with Angular guidelines ([00b8e71][], [#18][])
- **general**
    - Improved minification ([5e2bf29][], [503d380][], [#27][])

[1a0b256]: https://github.com/mbenford/ngTagsInput/commit/1a0b256
[7d3c51a]: https://github.com/mbenford/ngTagsInput/commit/7d3c51a
[69415a2]: https://github.com/mbenford/ngTagsInput/commit/69415a2
[298bf11]: https://github.com/mbenford/ngTagsInput/commit/298bf11
[1a6527f]: https://github.com/mbenford/ngTagsInput/commit/1a6527f
[c17d7a4]: https://github.com/mbenford/ngTagsInput/commit/c17d7a4
[ce73779]: https://github.com/mbenford/ngTagsInput/commit/ce73779
[b2ae61b]: https://github.com/mbenford/ngTagsInput/commit/b2ae61b
[a27363d]: https://github.com/mbenford/ngTagsInput/commit/a27363d
[4f868e0]: https://github.com/mbenford/ngTagsInput/commit/4f868e0
[c2b43c6]: https://github.com/mbenford/ngTagsInput/commit/c2b43c6
[00b8e71]: https://github.com/mbenford/ngTagsInput/commit/00b8e71
[5e2bf29]: https://github.com/mbenford/ngTagsInput/commit/5e2bf29
[503d380]: https://github.com/mbenford/ngTagsInput/commit/503d380
[84bb916]: https://github.com/mbenford/ngTagsInput/commit/84bb916
[1db08aa]: https://github.com/mbenford/ngTagsInput/commit/1db08aa
[#17]: https://github.com/mbenford/ngTagsInput/issues/17
[#18]: https://github.com/mbenford/ngTagsInput/issues/18
[#19]: https://github.com/mbenford/ngTagsInput/issues/19
[#21]: https://github.com/mbenford/ngTagsInput/issues/21
[#22]: https://github.com/mbenford/ngTagsInput/issues/22
[#23]: https://github.com/mbenford/ngTagsInput/issues/23
[#25]: https://github.com/mbenford/ngTagsInput/issues/25
[#26]: https://github.com/mbenford/ngTagsInput/issues/26
[#27]: https://github.com/mbenford/ngTagsInput/issues/27
[#29]: https://github.com/mbenford/ngTagsInput/issues/29
[#30]: https://github.com/mbenford/ngTagsInput/issues/30
[#32]: https://github.com/mbenford/ngTagsInput/issues/32

## v0.1.5 (2013-11-23)

- Renamed autocomplete directive as auto-complete so it doesn't conflict with input's autocomplete attribute
- Changed 'restrict' property of both tags-input and auto-complete directives to 'E'

## v0.1.4 (2013-11-21)

- Added basic autocomplete support
- Added onTagAdded and onTagRemoved callbacks

## v0.1.3 (2013-10-02)

- Added support for one-time string interpolation to all options

## v0.1.2 (2013-09-08)

- Fixed the CSS classes so the directive gets rendered consistently across different browsers

## v0.1.1 (2013-08-17)

- Removed allowed-chars-pattern option since it wouldn't prevent invalid chars from being inserted by pasting data from the clipboard. The allowed-tags-pattern option is the correct way to validate input from now on
