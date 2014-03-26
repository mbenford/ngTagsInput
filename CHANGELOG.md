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
