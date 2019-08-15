L.EditHandle = L.Marker.extend({
  initialize: function(overlay, corner, options) {
    const latlng = overlay.getCorner(corner);

    L.setOptions(this, options);

    this._handled = overlay;
    this._corner = corner;

    const markerOptions = {
      draggable: true,
      zIndexOffset: 10,
    };

    if (options && options.hasOwnProperty('draggable')) {
      markerOptions.draggable = options.draggable;
    }

    L.Marker.prototype.initialize.call(this, latlng, markerOptions);
  },

  onAdd: function(map) {
    L.Marker.prototype.onAdd.call(this, map);
    this._bindListeners();

    this.updateHandle();
  },

  onRemove: function(map) {
    this._unbindListeners();
    L.Marker.prototype.onRemove.call(this, map);
  },

  _onHandleDragStart: function() {
    this._handled.fire('editstart');
  },

  _onHandleDragEnd: function() {
    this._fireEdit();
  },

  _fireEdit: function() {
    this._handled.edited = true;
    this._handled.fire('edit');
  },

  _bindListeners: function() {
    this.on(
        {
          dragstart: this._onHandleDragStart,
          drag: this._onHandleDrag,
          dragend: this._onHandleDragEnd,
        },
        this
    );

    this._handled._map.on('zoomend', this.updateHandle, this);

    this._handled.on('update', this.updateHandle, this);
  },

  _unbindListeners: function() {
    this.off(
        {
          dragstart: this._onHandleDragStart,
          drag: this._onHandleDrag,
          dragend: this._onHandleDragEnd,
        },
        this
    );

    this._handled._map.off('zoomend', this.updateHandle, this);
    this._handled.off('update', this.updateHandle, this);
  },

  /* Takes two latlngs and calculates the scaling difference. */
  _calculateScalingFactor: function(latlngA, latlngB) {
    const overlay = this._handled;
    const map = overlay._map;

    const centerPoint = map.latLngToLayerPoint(overlay.getCenter());
    const formerPoint = map.latLngToLayerPoint(latlngA);
    const newPoint = map.latLngToLayerPoint(latlngB);
    const formerRadiusSquared = this._d2(centerPoint, formerPoint);
    const newRadiusSquared = this._d2(centerPoint, newPoint);

    return Math.sqrt(newRadiusSquared / formerRadiusSquared);
  },

  /* Distance between two points in cartesian space,
  * squared (distance formula). */
  _d2: function(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.pow(dx, 2) + Math.pow(dy, 2);
  },

  /* Takes two latlngs and calculates the angle between them. */
  calculateAngleDelta: function(latlngA, latlngB) {
    const overlay = this._handled;
    const map = overlay._map;

    const centerPoint = map.latLngToLayerPoint(overlay.getCenter());
    const formerPoint = map.latLngToLayerPoint(latlngA);
    const newPoint = map.latLngToLayerPoint(latlngB);

    const initialAngle = Math.
        atan2(
            centerPoint.y - formerPoint.y, centerPoint.x - formerPoint.x);
    const newAngle = Math.
        atan2(
            centerPoint.y - newPoint.y, centerPoint.x - newPoint.x);

    return newAngle - initialAngle;
  },
});
