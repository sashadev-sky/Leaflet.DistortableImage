L.DistortableImage = L.DistortableImage || {};

var EditOverlayAction = L.Toolbar2.Action.extend({
		initialize: function(map, overlay, options) {
			this._overlay = overlay;
			this._map = map;

			L.Toolbar2.Action.prototype.initialize.call(this, options);
		}
	}),

	ToggleTransparency = EditOverlayAction.extend({
		options: { toolbarIcon: {
			html: '<span class="fa fa-adjust"></span>',
			tooltip: 'Toggle Image Transparency',
			title: 'Toggle Image Transparency'
		}},

		addHooks: function() {
			var editing = this._overlay.editing;

			editing._toggleTransparency();
			this.disable();
		}
	}),

	ToggleOutline = EditOverlayAction.extend({
		options: { toolbarIcon: {
			html: '<span class="fa fa-square-o"></span>',
			tooltip: 'Toggle Image Outline',
			title: 'Toggle Image Outline'
		}},

		addHooks: function() {
			var editing = this._overlay.editing;

			editing._toggleOutline();
			this.disable();
		}
	}),

	RemoveOverlay = EditOverlayAction.extend({
		options: { toolbarIcon: {
			html: '<span class="fa fa-trash"></span>',
			tooltip: 'Delete image',
			title: 'Delete image'
		}},

		addHooks: function() {
			var editing = this._overlay.editing;
	
			editing._removeOverlay();
			this.disable();
		}
	}),

	ToggleEditable = EditOverlayAction.extend({
		options: { toolbarIcon: {
			html: '<span class="fa fa-lock"></span>',
			tooltip: 'Lock / Unlock editing',
			title: 'Lock / Unlock editing'
		}},

		addHooks: function() {
			var editing = this._overlay.editing;

			editing._toggleLock();
			this.disable();
		}
	}),

	ToggleRotateScale = EditOverlayAction.extend({
		initialize: function(map, overlay, options) {
			var icon = overlay.editing._mode === 'rotateScale' ? 'image' : 'rotate-left';

			options = options || {};
			options.toolbarIcon = {
				html: '<span class="fa fa-' + icon + '"></span>',
				tooltip: 'RotateScale',
				title: 'RotateScale'
			};

			EditOverlayAction.prototype.initialize.call(this, map, overlay, options);
		},

		addHooks: function() {
			var editing = this._overlay.editing;

			editing._toggleRotateScale();
			editing._showToolbar();
			this.disable();
		}
	}),


	ToggleExport = EditOverlayAction.extend({
		options: {
			toolbarIcon: {
				html: '<span class="fa fa-download"></span>',
				tooltip: 'Export Image',
				title: 'Export Image'
			}
		},

		addHooks: function ()
		{
			var editing = this._overlay.editing;

			editing._toggleExport();
			this.disable();
		}
	}),

	ToggleOrder = EditOverlayAction.extend({
		options: {
			toolbarIcon: {
				html: '<span class="fa fa-sort"></span>',
				tooltip: 'Change order',
				title: 'Toggle order'
			}
		},

		addHooks: function ()
		{
			var editing = this._overlay.editing;

			editing._toggleOrder();
			this.disable();
		}
	}),

  EnableEXIF = EditOverlayAction.extend({
  options: {
    toolbarIcon: {
      html: '<span class="fa fa-compass"></span>',
      tooltip: "Enable EXIF",
      title: "Geocode Image"
    }
  },

  addHooks: function() {
    var image = this._overlay._image;
    EXIF.getData(image, L.EXIF(image));
  }
  });

L.DistortableImage.EditToolbar = L.Toolbar2.Popup.extend({
  options: {
    actions: [
      ToggleTransparency,
      RemoveOverlay,
      ToggleOutline,
      ToggleEditable,
      ToggleRotateScale,
      ToggleExport,
      EnableEXIF,
      ToggleOrder
    ]
  },

  // todo: move to some sort of util class, these methods could be useful in future
  _rotateToolbarAngleDeg: function(angle) {
    var div = this._container,
      divStyle = div.style;

    var oldTransform = divStyle.transform;

    divStyle.transform = oldTransform + "rotate(" + angle + "deg)";
    divStyle.transformOrigin = "1080% 650%";

    this._rotateToolbarIcons(angle);
  },

  _rotateToolbarIcons: function(angle) {
    var icons = document.querySelectorAll(".fa");

    for (var i = 0; i < icons.length; i++) {
      icons.item(i).style.transform = "rotate(" + -angle + "deg)";
    }
  }
});
