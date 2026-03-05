import { r as registerInstance, d as getElement } from './index-DoE5X9BW.js';
import { a as getAugmentedNamespace, g as getDefaultExportFromCjs } from './_commonjsHelpers-Cf5sKic0.js';
import { g as getStore } from './store-C9Stgfg-.js';

var taucharts$1 = {exports: {}};

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none$2() {}

function selector(selector) {
  return selector == null ? none$2 : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

function empty$1() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty$1 : function() {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection$1(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant$7(x) {
  return function() {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

function selection_data(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$7(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection$1(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection$1(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending$2;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection$1(sortgroups, this._parents).order();
}

function ascending$2(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS$1(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction$1(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS$1(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction$1(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove$1 : typeof value === "function"
            ? styleFunction$1
            : styleConstant$1)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction$1
          : textConstant$1)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise$1() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise$1);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

var filterEvents = {};

var event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).
    event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      event = event0;
    }
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, capture) {
  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = event;
  event1.sourceEvent = event;
  event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    event = event0;
  }
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

var root$1 = [null];

function Selection$1(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection$1([[document.documentElement]], root$1);
}

Selection$1.prototype = selection.prototype = {
  constructor: Selection$1,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
      : new Selection$1([[selector]], root$1);
}

function create$1(name) {
  return select(creator(name).call(document.documentElement));
}

var nextId = 0;

function local$1() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local$1.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

function sourceEvent() {
  var current = event, source;
  while (source = current.sourceEvent) current = source;
  return current;
}

function point$5(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

function mouse(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point$5(node, event);
}

function selectAll(selector) {
  return typeof selector === "string"
      ? new Selection$1([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection$1([selector == null ? [] : selector], root$1);
}

function touch(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point$5(node, touch);
    }
  }

  return null;
}

function touches(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point$5(node, touches[i]);
  }

  return points;
}

var src$c = /*#__PURE__*/Object.freeze({
  __proto__: null,
  clientPoint: point$5,
  create: create$1,
  creator: creator,
  customEvent: customEvent,
  get event () { return event; },
  local: local$1,
  matcher: matcher,
  mouse: mouse,
  namespace: namespace,
  namespaces: namespaces,
  select: select,
  selectAll: selectAll,
  selection: selection,
  selector: selector,
  selectorAll: selectorAll,
  style: styleValue,
  touch: touch,
  touches: touches,
  window: defaultView
});

var require$$1$2 = /*@__PURE__*/getAugmentedNamespace(src$c);

function ascending$1(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function(d, x) {
    return ascending$1(f(d), x);
  };
}

var ascendingBisect = bisector(ascending$1);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;

function pairs(array, f) {
  if (f == null) f = pair;
  var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
  while (i < n) pairs[i] = f(p, p = array[++i]);
  return pairs;
}

function pair(a, b) {
  return [a, b];
}

function cross$1(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;

  if (reduce == null) reduce = pair;

  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
}

function descending$2(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

function number$3(x) {
  return x === null ? NaN : +x;
}

function variance(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0,
      value,
      delta,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number$3(values[i]))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number$3(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
}

function deviation(array, f) {
  var v = variance(array, f);
  return v ? Math.sqrt(v) : v;
}

function extent$1(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
}

var array$2 = Array.prototype;

var slice$3 = array$2.slice;
var map$3 = array$2.map;

function constant$6(x) {
  return function() {
    return x;
  };
}

function identity$8(x) {
  return x;
}

function range$1(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function ticks(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;

  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

function sturges(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}

function histogram() {
  var value = identity$8,
      domain = extent$1,
      threshold = sturges;

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      tz = tickStep(x0, x1, tz);
      tz = range$1(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    }

    // Remove any thresholds outside the domain.
    var m = tz.length;
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {
        bins[bisectRight(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant$6(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant$6([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant$6(slice$3.call(_)) : constant$6(_), histogram) : threshold;
  };

  return histogram;
}

function threshold$1(values, p, valueof) {
  if (valueof == null) valueof = number$3;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
}

function freedmanDiaconis(values, min, max) {
  values = map$3.call(values, number$3).sort(ascending$1);
  return Math.ceil((max - min) / (2 * (threshold$1(values, 0.75) - threshold$1(values, 0.25)) * Math.pow(values.length, -1 / 3)));
}

function scott(values, min, max) {
  return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
}

function max$1(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
}

function mean(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number$3(values[i]))) sum += value;
      else --m;
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number$3(valueof(values[i], i, values)))) sum += value;
      else --m;
    }
  }

  if (m) return sum / m;
}

function median(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number$3(values[i]))) {
        numbers.push(value);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number$3(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  return threshold$1(numbers.sort(ascending$1), 0.5);
}

function merge$1(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;
  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
}

function min$1(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
}

function permute(array, indexes) {
  var i = indexes.length, permutes = new Array(i);
  while (i--) permutes[i] = array[indexes[i]];
  return permutes;
}

function scan(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];

  if (compare == null) compare = ascending$1;

  while (++i < n) {
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  if (compare(xj, xj) === 0) return j;
}

function shuffle(array, i0, i1) {
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
}

function sum$2(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  }

  else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
}

function transpose(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = min$1(matrix, length$1), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
}

function length$1(d) {
  return d.length;
}

function zip() {
  return transpose(arguments);
}

var src$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ascending: ascending$1,
  bisect: bisectRight,
  bisectLeft: bisectLeft,
  bisectRight: bisectRight,
  bisector: bisector,
  cross: cross$1,
  descending: descending$2,
  deviation: deviation,
  extent: extent$1,
  histogram: histogram,
  max: max$1,
  mean: mean,
  median: median,
  merge: merge$1,
  min: min$1,
  pairs: pairs,
  permute: permute,
  quantile: threshold$1,
  range: range$1,
  scan: scan,
  shuffle: shuffle,
  sum: sum$2,
  thresholdFreedmanDiaconis: freedmanDiaconis,
  thresholdScott: scott,
  thresholdSturges: sturges,
  tickIncrement: tickIncrement,
  tickStep: tickStep,
  ticks: ticks,
  transpose: transpose,
  variance: variance,
  zip: zip
});

var require$$1$1 = /*@__PURE__*/getAugmentedNamespace(src$b);

var prefix = "$";

function Map$1() {}

Map$1.prototype = map$2.prototype = {
  constructor: Map$1,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map$2(object, f) {
  var map = new Map$1;

  // Copy constructor.
  if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

function nest() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = map$2(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function(values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    var array, sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();
    else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
    return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
  }

  return nest = {
    object: function(array) { return apply(array, 0, createObject, setObject); },
    map: function(array) { return apply(array, 0, createMap, setMap); },
    entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
    key: function(d) { keys.push(d); return nest; },
    sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
    sortValues: function(order) { sortValues = order; return nest; },
    rollup: function(f) { rollup = f; return nest; }
  };
}

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map$2();
}

function setMap(map, key, value) {
  map.set(key, value);
}

function Set$1() {}

var proto = map$2.prototype;

Set$1.prototype = set$2.prototype = {
  constructor: Set$1,
  has: proto.has,
  add: function(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set$2(object, f) {
  var set = new Set$1;

  // Copy constructor.
  if (object instanceof Set$1) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

function keys(map) {
  var keys = [];
  for (var key in map) keys.push(key);
  return keys;
}

function values(map) {
  var values = [];
  for (var key in map) values.push(map[key]);
  return values;
}

function entries(map) {
  var entries = [];
  for (var key in map) entries.push({key: key, value: map[key]});
  return entries;
}

var array$1 = Array.prototype;

var map$1 = array$1.map;
var slice$2 = array$1.slice;

var implicit = {name: "implicit"};

function ordinal(range) {
  var index = map$2(),
      domain = [],
      unknown = implicit;

  range = range == null ? [] : slice$2.call(range);

  function scale(d) {
    var key = d + "", i = index.get(key);
    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
    }
    return range[(i - 1) % range.length];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = map$2();
    var i = -1, n = _.length, d, key;
    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
    return scale;
  };

  scale.range = function(_) {
    return arguments.length ? (range = slice$2.call(_), scale) : range.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return ordinal()
        .domain(domain)
        .range(range)
        .unknown(unknown);
  };

  return scale;
}

function band() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range[1] < range[0],
        start = range[reverse - 0],
        stop = range[1 - reverse];
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = range$1(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
  };

  scale.rangeRound = function(_) {
    return range = [+_[0], +_[1]], round = true, rescale();
  };

  scale.bandwidth = function() {
    return bandwidth;
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
  };

  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function() {
    return band()
        .domain(domain())
        .range(range)
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };

  return rescale();
}

function pointish(scale) {
  var copy = scale.copy;

  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function() {
    return pointish(copy());
  };

  return scale;
}

function point$4() {
  return pointish(band().paddingInner(1));
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
    reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
    reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
    reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
    reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
    reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHex8() {
  return this.rgb().formatHex8();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}

function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}

function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}

function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}

function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}

function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl$2(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl$2, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));

function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}

function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

const radians$1 = Math.PI / 180;
const degrees$2 = 180 / Math.PI;

// https://observablehq.com/@mbostock/lab-and-rgb
const K = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0$1 = 4 / 29,
    t1$1 = 6 / 29,
    t2 = 3 * t1$1 * t1$1,
    t3 = t1$1 * t1$1 * t1$1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) return hcl2lab(o);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
  if (r === g && g === b) x = z = y; else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function gray(l, opacity) {
  return new Lab(l, 0, 0, opacity == null ? 1 : opacity);
}

function lab$1(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

define(Lab, lab$1, extend(Color, {
  brighter(k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker(k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new Rgb(
      lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
      lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
      lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
      this.opacity
    );
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0$1;
}

function lab2xyz(t) {
  return t > t1$1 ? t * t * t : t2 * (t - t0$1);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
  var h = Math.atan2(o.b, o.a) * degrees$2;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function lch(l, c, h, opacity) {
  return arguments.length === 1 ? hclConvert(l) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function hcl$2(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

function hcl2lab(o) {
  if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
  var h = o.h * radians$1;
  return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}

define(Hcl, hcl$2, extend(Color, {
  brighter(k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker(k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb() {
    return hcl2lab(this).rgb();
  }
}));

var A = -0.14861,
    B = +1.78277,
    C = -0.29227,
    D = -0.90649,
    E = +1.97294,
    ED = E * D,
    EB = E * B,
    BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
      h = s ? Math.atan2(k, bl) * degrees$2 - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix$3(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Cubehelix, cubehelix$3, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * radians$1,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh + B * sinh)),
      255 * (l + a * (C * cosh + D * sinh)),
      255 * (l + a * (E * cosh)),
      this.opacity
    );
  }
}));

var src$a = /*#__PURE__*/Object.freeze({
  __proto__: null,
  color: color,
  cubehelix: cubehelix$3,
  gray: gray,
  hcl: hcl$2,
  hsl: hsl$2,
  lab: lab$1,
  lch: lch,
  rgb: rgb
});

function basis$1(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
      + (4 - 6 * t2 + 3 * t3) * v1
      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
      + t3 * v3) / 6;
}

function basis$2(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis$1((t - i / n) * n, v0, v1, v2, v3);
  };
}

function basisClosed$1(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return basis$1((t - i / n) * n, v0, v1, v2, v3);
  };
}

function constant$5(x) {
  return function() {
    return x;
  };
}

function linear$2(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue$1(a, b) {
  var d = b - a;
  return d ? linear$2(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$5(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant$5(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear$2(a, d) : constant$5(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;

  return rgb$1;
})(1);

function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i, color;
    for (i = 0; i < n; ++i) {
      color = rgb(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function(t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}

var rgbBasis = rgbSpline(basis$2);
var rgbBasisClosed = rgbSpline(basisClosed$1);

function numberArray(a, b) {
  if (!b) b = [];
  var n = a ? Math.min(b.length, a.length) : 0,
      c = b.slice(),
      i;
  return function(t) {
    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}

function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

function array(a, b) {
  return (isNumberArray(b) ? numberArray : genericArray)(a, b);
}

function genericArray(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = interpolate$2(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
}

function date$1(a, b) {
  var d = new Date;
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

function object$2(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = interpolate$2(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

function interpolate$2(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant$5(b)
      : (t === "number" ? interpolateNumber
      : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
      : b instanceof color ? interpolateRgb
      : b instanceof Date ? date$1
      : isNumberArray(b) ? numberArray
      : Array.isArray(b) ? genericArray
      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object$2
      : interpolateNumber)(a, b);
}

function discrete(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

function hue(a, b) {
  var i = hue$1(+a, +b);
  return function(t) {
    var x = i(t);
    return x - 360 * Math.floor(x / 360);
  };
}

function interpolateRound(a, b) {
  return a = +a, b = +b, function(t) {
    return Math.round(a * (1 - t) + b * t);
  };
}

var degrees$1 = 180 / Math.PI;

var identity$7 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees$1,
    skewX: Math.atan(skewX) * degrees$1,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var cssNode,
    cssRoot,
    cssView,
    svgNode;

function parseCss(value) {
  if (value === "none") return identity$7;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return identity$7;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$7;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var rho = Math.SQRT2,
    rho2 = 2,
    rho4 = 4,
    epsilon2$1 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

// p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]
function zoom(p0, p1) {
  var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
      ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
      dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      i,
      S;

  // Special case for u0 ≅ u1.
  if (d2 < epsilon2$1) {
    S = Math.log(w1 / w0) / rho;
    i = function(t) {
      return [
        ux0 + t * dx,
        uy0 + t * dy,
        w0 * Math.exp(rho * t * S)
      ];
    };
  }

  // General case.
  else {
    var d1 = Math.sqrt(d2),
        b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
        b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
        r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
        r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
    S = (r1 - r0) / rho;
    i = function(t) {
      var s = t * S,
          coshr0 = cosh(r0),
          u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
      return [
        ux0 + u * dx,
        uy0 + u * dy,
        w0 * coshr0 / cosh(rho * s + r0)
      ];
    };
  }

  i.duration = S * 1000;

  return i;
}

function hsl(hue) {
  return function(start, end) {
    var h = hue((start = hsl$2(start)).h, (end = hsl$2(end)).h),
        s = nogamma(start.s, end.s),
        l = nogamma(start.l, end.l),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
}

var hsl$1 = hsl(hue$1);
var hslLong = hsl(nogamma);

function lab(start, end) {
  var l = nogamma((start = lab$1(start)).l, (end = lab$1(end)).l),
      a = nogamma(start.a, end.a),
      b = nogamma(start.b, end.b),
      opacity = nogamma(start.opacity, end.opacity);
  return function(t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start + "";
  };
}

function hcl(hue) {
  return function(start, end) {
    var h = hue((start = hcl$2(start)).h, (end = hcl$2(end)).h),
        c = nogamma(start.c, end.c),
        l = nogamma(start.l, end.l),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
}

var hcl$1 = hcl(hue$1);
var hclLong = hcl(nogamma);

function cubehelix$1(hue) {
  return (function cubehelixGamma(y) {
    y = +y;

    function cubehelix(start, end) {
      var h = hue((start = cubehelix$3(start)).h, (end = cubehelix$3(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix.gamma = cubehelixGamma;

    return cubehelix;
  })(1);
}

var cubehelix$2 = cubehelix$1(hue$1);
var cubehelixLong = cubehelix$1(nogamma);

function piecewise(interpolate, values) {
  var i = 0, n = values.length - 1, v = values[0], I = new Array(n < 0 ? 0 : n);
  while (i < n) I[i] = interpolate(v, v = values[++i]);
  return function(t) {
    var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return I[i](t - i);
  };
}

function quantize$2(interpolator, n) {
  var samples = new Array(n);
  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
  return samples;
}

function constant$4(x) {
  return function() {
    return x;
  };
}

function number$2(x) {
  return +x;
}

var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : constant$4(b);
}

function deinterpolateClamp(deinterpolate) {
  return function(a, b) {
    var d = deinterpolate(a = +a, b = +b);
    return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
  };
}

function reinterpolateClamp(reinterpolate) {
  return function(a, b) {
    var r = reinterpolate(a = +a, b = +b);
    return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
  };
}

function bimap(domain, range, deinterpolate, reinterpolate) {
  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
  else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
  return function(x) { return r0(d0(x)); };
}

function polymap(domain, range, deinterpolate, reinterpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = deinterpolate(domain[i], domain[i + 1]);
    r[i] = reinterpolate(range[i], range[i + 1]);
  }

  return function(x) {
    var i = bisectRight(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target
      .domain(source.domain())
      .range(source.range())
      .interpolate(source.interpolate())
      .clamp(source.clamp());
}

// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
function continuous(deinterpolate, reinterpolate) {
  var domain = unit,
      range = unit,
      interpolate = interpolate$2,
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate)))(+x);
  }

  scale.invert = function(y) {
    return (input || (input = piecewise(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function(_) {
    return arguments.length ? (domain = map$1.call(_, number$2), rescale()) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = slice$2.call(_), rescale()) : range.slice();
  };

  scale.rangeRound = function(_) {
    return range = slice$2.call(_), interpolate = interpolateRound, rescale();
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, rescale()) : clamp;
  };

  scale.interpolate = function(_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  return rescale();
}

function formatDecimal(x) {
  return Math.abs(x = Math.round(x)) >= 1e21
      ? x.toLocaleString("en").replace(/,/g, "")
      : x.toString(10);
}

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimalParts(1.23) returns ["123", 0].
function formatDecimalParts(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

function exponent$1(x) {
  return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}

function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}

function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
  this.align = specifier.align === undefined ? ">" : specifier.align + "";
  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === undefined ? undefined : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === undefined ? "" : specifier.type + "";
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width === undefined ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
      + (this.trim ? "~" : "")
      + this.type;
};

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function formatTrim(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

var prefixExponent;

function formatPrefixAuto(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}

function formatRounded(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

var formatTypes = {
  "%": function(x, p) { return (x * 100).toFixed(p); },
  "b": function(x) { return Math.round(x).toString(2); },
  "c": function(x) { return x + ""; },
  "d": formatDecimal,
  "e": function(x, p) { return x.toExponential(p); },
  "f": function(x, p) { return x.toFixed(p); },
  "g": function(x, p) { return x.toPrecision(p); },
  "o": function(x) { return Math.round(x).toString(8); },
  "p": function(x, p) { return formatRounded(x * 100, p); },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
  "x": function(x) { return Math.round(x).toString(16); }
};

function identity$6(x) {
  return x;
}

var map = Array.prototype.map,
    prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

function formatLocale$1(locale) {
  var group = locale.grouping === undefined || locale.thousands === undefined ? identity$6 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
      currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
      currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
      decimal = locale.decimal === undefined ? "." : locale.decimal + "",
      numerals = locale.numerals === undefined ? identity$6 : formatNumerals(map.call(locale.numerals, String)),
      percent = locale.percent === undefined ? "%" : locale.percent + "",
      minus = locale.minus === undefined ? "-" : locale.minus + "",
      nan = locale.nan === undefined ? "NaN" : locale.nan + "";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type;

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision === undefined ? 6
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Determine the sign. -0 is not less than 0, but 1 / -0 is!
        var valueNegative = value < 0 || 1 / value < 0;

        // Perform the initial formatting.
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

        // Trim insignificant zeros.
        if (trim) value = formatTrim(value);

        // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
        if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}

var locale$1;
var format;
var formatPrefix;

defaultLocale$1({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});

function defaultLocale$1(definition) {
  locale$1 = formatLocale$1(definition);
  format = locale$1.format;
  formatPrefix = locale$1.formatPrefix;
  return locale$1;
}

function precisionFixed(step) {
  return Math.max(0, -exponent$1(Math.abs(step)));
}

function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3 - exponent$1(Math.abs(step)));
}

function precisionRound(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent$1(max) - exponent$1(step)) + 1;
}

var src$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  FormatSpecifier: FormatSpecifier,
  get format () { return format; },
  formatDefaultLocale: defaultLocale$1,
  formatLocale: formatLocale$1,
  get formatPrefix () { return formatPrefix; },
  formatSpecifier: formatSpecifier,
  precisionFixed: precisionFixed,
  precisionPrefix: precisionPrefix,
  precisionRound: precisionRound
});

function tickFormat(domain, count, specifier) {
  var start = domain[0],
      stop = domain[domain.length - 1],
      step = tickStep(start, stop, count == null ? 10 : count),
      precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain(), count, specifier);
  };

  scale.nice = function(count) {
    if (count == null) count = 10;

    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = tickIncrement(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = tickIncrement(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = tickIncrement(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear$1() {
  var scale = continuous(deinterpolateLinear, interpolateNumber);

  scale.copy = function() {
    return copy(scale, linear$1());
  };

  return linearish(scale);
}

function identity$5() {
  var domain = [0, 1];

  function scale(x) {
    return +x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function(_) {
    return arguments.length ? (domain = map$1.call(_, number$2), scale) : domain.slice();
  };

  scale.copy = function() {
    return identity$5().domain(domain);
  };

  return linearish(scale);
}

function nice(domain, interval) {
  domain = domain.slice();

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}

function deinterpolate(a, b) {
  return (b = Math.log(b / a))
      ? function(x) { return Math.log(x / a) / b; }
      : constant$4(b);
}

function reinterpolate(a, b) {
  return a < 0
      ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
      : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10
      : base === Math.E ? Math.exp
      : function(x) { return Math.pow(base, x); };
}

function logp(base) {
  return base === Math.E ? Math.log
      : base === 10 && Math.log10
      || base === 2 && Math.log2
      || (base = Math.log(base), function(x) { return Math.log(x) / base; });
}

function reflect(f) {
  return function(x) {
    return -f(-x);
  };
}

function log$1() {
  var scale = continuous(deinterpolate, reinterpolate).domain([1, 10]),
      domain = scale.domain,
      base = 10,
      logs = logp(10),
      pows = powp(10);

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
    return scale;
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function(count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;

    if (r = v < u) i = u, u = v, v = i;

    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = ticks(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function(count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = format(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function(d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function() {
    return domain(nice(domain(), {
      floor: function(x) { return pows(Math.floor(logs(x))); },
      ceil: function(x) { return pows(Math.ceil(logs(x))); }
    }));
  };

  scale.copy = function() {
    return copy(scale, log$1().base(base));
  };

  return scale;
}

function raise(x, exponent) {
  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
}

function pow$1() {
  var exponent = 1,
      scale = continuous(deinterpolate, reinterpolate),
      domain = scale.domain;

  function deinterpolate(a, b) {
    return (b = raise(b, exponent) - (a = raise(a, exponent)))
        ? function(x) { return (raise(x, exponent) - a) / b; }
        : constant$4(b);
  }

  function reinterpolate(a, b) {
    b = raise(b, exponent) - (a = raise(a, exponent));
    return function(t) { return raise(a + b * t, 1 / exponent); };
  }

  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
  };

  scale.copy = function() {
    return copy(scale, pow$1().exponent(exponent));
  };

  return linearish(scale);
}

function sqrt$2() {
  return pow$1().exponent(0.5);
}

function quantile() {
  var domain = [],
      range = [],
      thresholds = [];

  function rescale() {
    var i = 0, n = Math.max(1, range.length);
    thresholds = new Array(n - 1);
    while (++i < n) thresholds[i - 1] = threshold$1(domain, i / n);
    return scale;
  }

  function scale(x) {
    if (!isNaN(x = +x)) return range[bisectRight(thresholds, x)];
  }

  scale.invertExtent = function(y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : [
      i > 0 ? thresholds[i - 1] : domain[0],
      i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
    ];
  };

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [];
    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
    domain.sort(ascending$1);
    return rescale();
  };

  scale.range = function(_) {
    return arguments.length ? (range = slice$2.call(_), rescale()) : range.slice();
  };

  scale.quantiles = function() {
    return thresholds.slice();
  };

  scale.copy = function() {
    return quantile()
        .domain(domain)
        .range(range);
  };

  return scale;
}

function quantize$1() {
  var x0 = 0,
      x1 = 1,
      n = 1,
      domain = [0.5],
      range = [0, 1];

  function scale(x) {
    if (x <= x) return range[bisectRight(domain, x, 0, n)];
  }

  function rescale() {
    var i = -1;
    domain = new Array(n);
    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
    return scale;
  }

  scale.domain = function(_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
  };

  scale.range = function(_) {
    return arguments.length ? (n = (range = slice$2.call(_)).length - 1, rescale()) : range.slice();
  };

  scale.invertExtent = function(y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN]
        : i < 1 ? [x0, domain[0]]
        : i >= n ? [domain[n - 1], x1]
        : [domain[i - 1], domain[i]];
  };

  scale.copy = function() {
    return quantize$1()
        .domain([x0, x1])
        .range(range);
  };

  return linearish(scale);
}

function threshold() {
  var domain = [0.5],
      range = [0, 1],
      n = 1;

  function scale(x) {
    if (x <= x) return range[bisectRight(domain, x, 0, n)];
  }

  scale.domain = function(_) {
    return arguments.length ? (domain = slice$2.call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = slice$2.call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
  };

  scale.invertExtent = function(y) {
    var i = range.indexOf(y);
    return [domain[i - 1], domain[i]];
  };

  scale.copy = function() {
    return threshold()
        .domain(domain)
        .range(range);
  };

  return scale;
}

var t0 = new Date,
    t1 = new Date;

function newInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
  }

  interval.floor = function(date) {
    return floori(date = new Date(+date)), date;
  };

  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function(date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
        }
      }
    });
  };

  if (count) {
    interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(0, d) % step === 0; });
    };
  }

  return interval;
}

var millisecond = newInterval(function() {
  // noop
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function(k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return newInterval(function(date) {
    date.setTime(Math.floor(date / k) * k);
  }, function(date, step) {
    date.setTime(+date + step * k);
  }, function(start, end) {
    return (end - start) / k;
  });
};
var milliseconds = millisecond.range;

var durationSecond$1 = 1e3;
var durationMinute$1 = 6e4;
var durationHour$1 = 36e5;
var durationDay$1 = 864e5;
var durationWeek$1 = 6048e5;

var second = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds());
}, function(date, step) {
  date.setTime(+date + step * durationSecond$1);
}, function(start, end) {
  return (end - start) / durationSecond$1;
}, function(date) {
  return date.getUTCSeconds();
});
var seconds = second.range;

var minute = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond$1);
}, function(date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function(start, end) {
  return (end - start) / durationMinute$1;
}, function(date) {
  return date.getMinutes();
});
var minutes = minute.range;

var hour = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond$1 - date.getMinutes() * durationMinute$1);
}, function(date, step) {
  date.setTime(+date + step * durationHour$1);
}, function(start, end) {
  return (end - start) / durationHour$1;
}, function(date) {
  return date.getHours();
});
var hours = hour.range;

var day = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1;
}, function(date) {
  return date.getDate() - 1;
});
var days = day.range;

function weekday(i) {
  return newInterval(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
  });
}

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var sundays = sunday.range;
var mondays = monday.range;
var tuesdays = tuesday.range;
var wednesdays = wednesday.range;
var thursdays = thursday.range;
var fridays = friday.range;
var saturdays = saturday.range;

var month = newInterval(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});
var months = month.range;

var year = newInterval(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
year.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};
var years = year.range;

var utcMinute = newInterval(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function(start, end) {
  return (end - start) / durationMinute$1;
}, function(date) {
  return date.getUTCMinutes();
});
var utcMinutes = utcMinute.range;

var utcHour = newInterval(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour$1);
}, function(start, end) {
  return (end - start) / durationHour$1;
}, function(date) {
  return date.getUTCHours();
});
var utcHours = utcHour.range;

var utcDay = newInterval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / durationDay$1;
}, function(date) {
  return date.getUTCDate() - 1;
});
var utcDays = utcDay.range;

function utcWeekday(i) {
  return newInterval(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek$1;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

var utcSundays = utcSunday.range;
var utcMondays = utcMonday.range;
var utcTuesdays = utcTuesday.range;
var utcWednesdays = utcWednesday.range;
var utcThursdays = utcThursday.range;
var utcFridays = utcFriday.range;
var utcSaturdays = utcSaturday.range;

var utcMonth = newInterval(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});
var utcMonths = utcMonth.range;

var utcYear = newInterval(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};
var utcYears = utcYear.range;

var src$8 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  timeDay: day,
  timeDays: days,
  timeFriday: friday,
  timeFridays: fridays,
  timeHour: hour,
  timeHours: hours,
  timeInterval: newInterval,
  timeMillisecond: millisecond,
  timeMilliseconds: milliseconds,
  timeMinute: minute,
  timeMinutes: minutes,
  timeMonday: monday,
  timeMondays: mondays,
  timeMonth: month,
  timeMonths: months,
  timeSaturday: saturday,
  timeSaturdays: saturdays,
  timeSecond: second,
  timeSeconds: seconds,
  timeSunday: sunday,
  timeSundays: sundays,
  timeThursday: thursday,
  timeThursdays: thursdays,
  timeTuesday: tuesday,
  timeTuesdays: tuesdays,
  timeWednesday: wednesday,
  timeWednesdays: wednesdays,
  timeWeek: sunday,
  timeWeeks: sundays,
  timeYear: year,
  timeYears: years,
  utcDay: utcDay,
  utcDays: utcDays,
  utcFriday: utcFriday,
  utcFridays: utcFridays,
  utcHour: utcHour,
  utcHours: utcHours,
  utcMillisecond: millisecond,
  utcMilliseconds: milliseconds,
  utcMinute: utcMinute,
  utcMinutes: utcMinutes,
  utcMonday: utcMonday,
  utcMondays: utcMondays,
  utcMonth: utcMonth,
  utcMonths: utcMonths,
  utcSaturday: utcSaturday,
  utcSaturdays: utcSaturdays,
  utcSecond: second,
  utcSeconds: seconds,
  utcSunday: utcSunday,
  utcSundays: utcSundays,
  utcThursday: utcThursday,
  utcThursdays: utcThursdays,
  utcTuesday: utcTuesday,
  utcTuesdays: utcTuesdays,
  utcWednesday: utcWednesday,
  utcWednesdays: utcWednesdays,
  utcWeek: utcSunday,
  utcWeeks: utcSundays,
  utcYear: utcYear,
  utcYears: utcYears
});

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newDate(y, m, d) {
  return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
}

function formatLocale(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "g": formatYearISO,
    "G": formatFullYearISO,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "q": formatQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "g": formatUTCYearISO,
    "G": formatUTCFullYearISO,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "q": formatUTCQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "g": parseYear,
    "G": parseFullYear,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "q": parseQuarter,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function(date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
          else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, Z) {
    return function(string) {
      var d = newDate(1900, undefined, 1),
          i = parseSpecifier(d, specifier, string += "", 0),
          week, day$1;
      if (i != string.length) return null;

      // If a UNIX timestamp is specified, return it.
      if ("Q" in d) return new Date(d.Q);
      if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

      // If this is utcParse, never use the local timezone.
      if (Z && !("Z" in d)) d.Z = 0;

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // If the month was not specified, inherit from the quarter.
      if (d.m === undefined) d.m = "q" in d ? d.q : 0;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate(newDate(d.y, 0, 1)), day$1 = week.getUTCDay();
          week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
          week = utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = localDate(newDate(d.y, 0, 1)), day$1 = week.getDay();
          week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
          week = day.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return localDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatQuarter(d) {
    return 1 + ~~(d.getMonth() / 3);
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  function formatUTCQuarter(d) {
    return 1 + ~~(d.getUTCMonth() / 3);
  }

  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() { return specifier; };
      return f;
    },
    parse: function(specifier) {
      var p = newParse(specifier += "", false);
      p.toString = function() { return specifier; };
      return p;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() { return specifier; };
      return f;
    },
    utcParse: function(specifier) {
      var p = newParse(specifier += "", true);
      p.toString = function() { return specifier; };
      return p;
    }
  };
}

var pads = {"-": "", "_": " ", "0": "0"},
    numberRe = /^\s*\d+/, // note: ignores next directive
    percentRe = /^%/,
    requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {}, i = -1, n = names.length;
  while (++i < n) map[names[i].toLowerCase()] = i;
  return map;
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseQuarter(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.s = +n[0], i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + day.count(year(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day = d.getDay();
  return day === 0 ? 7 : day;
}

function formatWeekNumberSunday(d, p) {
  return pad(sunday.count(year(d) - 1, d), p, 2);
}

function dISO(d) {
  var day = d.getDay();
  return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
}

function formatWeekNumberISO(d, p) {
  d = dISO(d);
  return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(monday.count(year(d) - 1, d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatYearISO(d, p) {
  d = dISO(d);
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatFullYearISO(d, p) {
  var day = d.getDay();
  d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+"))
      + pad(z / 60 | 0, "0", 2)
      + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
}

function UTCdISO(d) {
  var day = d.getUTCDay();
  return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
}

function formatUTCWeekNumberISO(d, p) {
  d = UTCdISO(d);
  return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCYearISO(d, p) {
  d = UTCdISO(d);
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCFullYearISO(d, p) {
  var day = d.getUTCDay();
  d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}

var locale;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;

defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  timeFormat = locale.format;
  timeParse = locale.parse;
  utcFormat = locale.utcFormat;
  utcParse = locale.utcParse;
  return locale;
}

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString
    ? formatIsoNative
    : utcFormat(isoSpecifier);

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z")
    ? parseIsoNative
    : utcParse(isoSpecifier);

var src$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isoFormat: formatIso,
  isoParse: parseIso,
  get timeFormat () { return timeFormat; },
  timeFormatDefaultLocale: defaultLocale,
  timeFormatLocale: formatLocale,
  get timeParse () { return timeParse; },
  get utcFormat () { return utcFormat; },
  get utcParse () { return utcParse; }
});

var durationSecond = 1000,
    durationMinute = durationSecond * 60,
    durationHour = durationMinute * 60,
    durationDay = durationHour * 24,
    durationWeek = durationDay * 7,
    durationMonth = durationDay * 30,
    durationYear = durationDay * 365;

function date(t) {
  return new Date(t);
}

function number$1(t) {
  return t instanceof Date ? +t : +new Date(+t);
}

function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
  var scale = continuous(deinterpolateLinear, interpolateNumber),
      invert = scale.invert,
      domain = scale.domain;

  var formatMillisecond = format(".%L"),
      formatSecond = format(":%S"),
      formatMinute = format("%I:%M"),
      formatHour = format("%I %p"),
      formatDay = format("%a %d"),
      formatWeek = format("%b %d"),
      formatMonth = format("%B"),
      formatYear = format("%Y");

  var tickIntervals = [
    [second,  1,      durationSecond],
    [second,  5,  5 * durationSecond],
    [second, 15, 15 * durationSecond],
    [second, 30, 30 * durationSecond],
    [minute,  1,      durationMinute],
    [minute,  5,  5 * durationMinute],
    [minute, 15, 15 * durationMinute],
    [minute, 30, 30 * durationMinute],
    [  hour,  1,      durationHour  ],
    [  hour,  3,  3 * durationHour  ],
    [  hour,  6,  6 * durationHour  ],
    [  hour, 12, 12 * durationHour  ],
    [   day,  1,      durationDay   ],
    [   day,  2,  2 * durationDay   ],
    [  week,  1,      durationWeek  ],
    [ month,  1,      durationMonth ],
    [ month,  3,  3 * durationMonth ],
    [  year,  1,      durationYear  ]
  ];

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond
        : minute(date) < date ? formatSecond
        : hour(date) < date ? formatMinute
        : day(date) < date ? formatHour
        : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
        : year(date) < date ? formatMonth
        : formatYear)(date);
  }

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10;

    // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.
    if (typeof interval === "number") {
      var target = Math.abs(stop - start) / interval,
          i = bisector(function(i) { return i[2]; }).right(tickIntervals, target);
      if (i === tickIntervals.length) {
        step = tickStep(start / durationYear, stop / durationYear, interval);
        interval = year;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = Math.max(tickStep(start, stop, interval), 1);
        interval = millisecond;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function(y) {
    return new Date(invert(y));
  };

  scale.domain = function(_) {
    return arguments.length ? domain(map$1.call(_, number$1)) : domain().map(date);
  };

  scale.ticks = function(interval, step) {
    var d = domain(),
        t0 = d[0],
        t1 = d[d.length - 1],
        r = t1 < t0,
        t;
    if (r) t = t0, t0 = t1, t1 = t;
    t = tickInterval(interval, t0, t1, step);
    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
    return r ? t.reverse() : t;
  };

  scale.tickFormat = function(count, specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.nice = function(interval, step) {
    var d = domain();
    return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
        ? domain(nice(d, interval))
        : scale;
  };

  scale.copy = function() {
    return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
  };

  return scale;
}

function time() {
  return calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
}

function utcTime() {
  return calendar(utcYear, utcMonth, utcSunday, utcDay, utcHour, utcMinute, second, millisecond, utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
}

function colors(s) {
  return s.match(/.{6}/g).map(function(x) {
    return "#" + x;
  });
}

var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

var category20b = colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

var category20c = colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

var category20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

var cubehelix = cubehelixLong(cubehelix$3(300, 0.5, 0.0), cubehelix$3(-240, 0.5, 1.0));

var warm = cubehelixLong(cubehelix$3(-100, 0.75, 0.35), cubehelix$3(80, 1.50, 0.8));

var cool = cubehelixLong(cubehelix$3(260, 0.75, 0.35), cubehelix$3(80, 1.50, 0.8));

var rainbow = cubehelix$3();

function rainbow$1(t) {
  if (t < 0 || t > 1) t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  rainbow.h = 360 * t - 100;
  rainbow.s = 1.5 - 1.5 * ts;
  rainbow.l = 0.8 - 0.9 * ts;
  return rainbow + "";
}

function ramp(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

var viridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

function sequential(interpolator) {
  var x0 = 0,
      x1 = 1,
      clamp = false;

  function scale(x) {
    var t = (x - x0) / (x1 - x0);
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.domain = function(_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function() {
    return sequential(interpolator).domain([x0, x1]).clamp(clamp);
  };

  return linearish(scale);
}

var d3Scale = /*#__PURE__*/Object.freeze({
  __proto__: null,
  interpolateCool: cool,
  interpolateCubehelixDefault: cubehelix,
  interpolateInferno: inferno,
  interpolateMagma: magma,
  interpolatePlasma: plasma,
  interpolateRainbow: rainbow$1,
  interpolateViridis: viridis,
  interpolateWarm: warm,
  scaleBand: band,
  scaleIdentity: identity$5,
  scaleImplicit: implicit,
  scaleLinear: linear$1,
  scaleLog: log$1,
  scaleOrdinal: ordinal,
  scalePoint: point$4,
  scalePow: pow$1,
  scaleQuantile: quantile,
  scaleQuantize: quantize$1,
  scaleSequential: sequential,
  scaleSqrt: sqrt$2,
  scaleThreshold: threshold,
  scaleTime: time,
  scaleUtc: utcTime,
  schemeCategory10: category10,
  schemeCategory20: category20,
  schemeCategory20b: category20b,
  schemeCategory20c: category20c
});

var require$$2 = /*@__PURE__*/getAugmentedNamespace(d3Scale);

function identity$4(x) {
  return x;
}

function transform$1(transform) {
  if (transform == null) return identity$4;
  var x0,
      y0,
      kx = transform.scale[0],
      ky = transform.scale[1],
      dx = transform.translate[0],
      dy = transform.translate[1];
  return function(input, i) {
    if (!i) x0 = y0 = 0;
    var j = 2, n = input.length, output = new Array(n);
    output[0] = (x0 += input[0]) * kx + dx;
    output[1] = (y0 += input[1]) * ky + dy;
    while (j < n) output[j] = input[j], ++j;
    return output;
  };
}

function bbox(topology) {
  var t = transform$1(topology.transform), key,
      x0 = Infinity, y0 = x0, x1 = -x0, y1 = -x0;

  function bboxPoint(p) {
    p = t(p);
    if (p[0] < x0) x0 = p[0];
    if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1];
    if (p[1] > y1) y1 = p[1];
  }

  function bboxGeometry(o) {
    switch (o.type) {
      case "GeometryCollection": o.geometries.forEach(bboxGeometry); break;
      case "Point": bboxPoint(o.coordinates); break;
      case "MultiPoint": o.coordinates.forEach(bboxPoint); break;
    }
  }

  topology.arcs.forEach(function(arc) {
    var i = -1, n = arc.length, p;
    while (++i < n) {
      p = t(arc[i], i);
      if (p[0] < x0) x0 = p[0];
      if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1];
      if (p[1] > y1) y1 = p[1];
    }
  });

  for (key in topology.objects) {
    bboxGeometry(topology.objects[key]);
  }

  return [x0, y0, x1, y1];
}

function reverse$1(array, n) {
  var t, j = array.length, i = j - n;
  while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
}

function feature(topology, o) {
  if (typeof o === "string") o = topology.objects[o];
  return o.type === "GeometryCollection"
      ? {type: "FeatureCollection", features: o.geometries.map(function(o) { return feature$1(topology, o); })}
      : feature$1(topology, o);
}

function feature$1(topology, o) {
  var id = o.id,
      bbox = o.bbox,
      properties = o.properties == null ? {} : o.properties,
      geometry = object$1(topology, o);
  return id == null && bbox == null ? {type: "Feature", properties: properties, geometry: geometry}
      : bbox == null ? {type: "Feature", id: id, properties: properties, geometry: geometry}
      : {type: "Feature", id: id, bbox: bbox, properties: properties, geometry: geometry};
}

function object$1(topology, o) {
  var transformPoint = transform$1(topology.transform),
      arcs = topology.arcs;

  function arc(i, points) {
    if (points.length) points.pop();
    for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
      points.push(transformPoint(a[k], k));
    }
    if (i < 0) reverse$1(points, n);
  }

  function point(p) {
    return transformPoint(p);
  }

  function line(arcs) {
    var points = [];
    for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
    if (points.length < 2) points.push(points[0]); // This should never happen per the specification.
    return points;
  }

  function ring(arcs) {
    var points = line(arcs);
    while (points.length < 4) points.push(points[0]); // This may happen if an arc has only two points.
    return points;
  }

  function polygon(arcs) {
    return arcs.map(ring);
  }

  function geometry(o) {
    var type = o.type, coordinates;
    switch (type) {
      case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
      case "Point": coordinates = point(o.coordinates); break;
      case "MultiPoint": coordinates = o.coordinates.map(point); break;
      case "LineString": coordinates = line(o.arcs); break;
      case "MultiLineString": coordinates = o.arcs.map(line); break;
      case "Polygon": coordinates = polygon(o.arcs); break;
      case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
      default: return null;
    }
    return {type: type, coordinates: coordinates};
  }

  return geometry(o);
}

function stitch(topology, arcs) {
  var stitchedArcs = {},
      fragmentByStart = {},
      fragmentByEnd = {},
      fragments = [],
      emptyIndex = -1;

  // Stitch empty arcs first, since they may be subsumed by other arcs.
  arcs.forEach(function(i, j) {
    var arc = topology.arcs[i < 0 ? ~i : i], t;
    if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
      t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
    }
  });

  arcs.forEach(function(i) {
    var e = ends(i),
        start = e[0],
        end = e[1],
        f, g;

    if (f = fragmentByEnd[start]) {
      delete fragmentByEnd[f.end];
      f.push(i);
      f.end = end;
      if (g = fragmentByStart[end]) {
        delete fragmentByStart[g.start];
        var fg = g === f ? f : f.concat(g);
        fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
      } else {
        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
      }
    } else if (f = fragmentByStart[end]) {
      delete fragmentByStart[f.start];
      f.unshift(i);
      f.start = start;
      if (g = fragmentByEnd[start]) {
        delete fragmentByEnd[g.end];
        var gf = g === f ? f : g.concat(f);
        fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
      } else {
        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
      }
    } else {
      f = [i];
      fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
    }
  });

  function ends(i) {
    var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
    if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
    else p1 = arc[arc.length - 1];
    return i < 0 ? [p1, p0] : [p0, p1];
  }

  function flush(fragmentByEnd, fragmentByStart) {
    for (var k in fragmentByEnd) {
      var f = fragmentByEnd[k];
      delete fragmentByStart[f.start];
      delete f.start;
      delete f.end;
      f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
      fragments.push(f);
    }
  }

  flush(fragmentByEnd, fragmentByStart);
  flush(fragmentByStart, fragmentByEnd);
  arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });

  return fragments;
}

function mesh(topology) {
  return object$1(topology, meshArcs.apply(this, arguments));
}

function meshArcs(topology, object, filter) {
  var arcs, i, n;
  if (arguments.length > 1) arcs = extractArcs(topology, object, filter);
  else for (i = 0, arcs = new Array(n = topology.arcs.length); i < n; ++i) arcs[i] = i;
  return {type: "MultiLineString", arcs: stitch(topology, arcs)};
}

function extractArcs(topology, object, filter) {
  var arcs = [],
      geomsByArc = [],
      geom;

  function extract0(i) {
    var j = i < 0 ? ~i : i;
    (geomsByArc[j] || (geomsByArc[j] = [])).push({i: i, g: geom});
  }

  function extract1(arcs) {
    arcs.forEach(extract0);
  }

  function extract2(arcs) {
    arcs.forEach(extract1);
  }

  function extract3(arcs) {
    arcs.forEach(extract2);
  }

  function geometry(o) {
    switch (geom = o, o.type) {
      case "GeometryCollection": o.geometries.forEach(geometry); break;
      case "LineString": extract1(o.arcs); break;
      case "MultiLineString": case "Polygon": extract2(o.arcs); break;
      case "MultiPolygon": extract3(o.arcs); break;
    }
  }

  geometry(object);

  geomsByArc.forEach(filter == null
      ? function(geoms) { arcs.push(geoms[0].i); }
      : function(geoms) { if (filter(geoms[0].g, geoms[geoms.length - 1].g)) arcs.push(geoms[0].i); });

  return arcs;
}

function planarRingArea(ring) {
  var i = -1, n = ring.length, a, b = ring[n - 1], area = 0;
  while (++i < n) a = b, b = ring[i], area += a[0] * b[1] - a[1] * b[0];
  return Math.abs(area); // Note: doubled area!
}

function merge(topology) {
  return object$1(topology, mergeArcs.apply(this, arguments));
}

function mergeArcs(topology, objects) {
  var polygonsByArc = {},
      polygons = [],
      groups = [];

  objects.forEach(geometry);

  function geometry(o) {
    switch (o.type) {
      case "GeometryCollection": o.geometries.forEach(geometry); break;
      case "Polygon": extract(o.arcs); break;
      case "MultiPolygon": o.arcs.forEach(extract); break;
    }
  }

  function extract(polygon) {
    polygon.forEach(function(ring) {
      ring.forEach(function(arc) {
        (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
      });
    });
    polygons.push(polygon);
  }

  function area(ring) {
    return planarRingArea(object$1(topology, {type: "Polygon", arcs: [ring]}).coordinates[0]);
  }

  polygons.forEach(function(polygon) {
    if (!polygon._) {
      var group = [],
          neighbors = [polygon];
      polygon._ = 1;
      groups.push(group);
      while (polygon = neighbors.pop()) {
        group.push(polygon);
        polygon.forEach(function(ring) {
          ring.forEach(function(arc) {
            polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
              if (!polygon._) {
                polygon._ = 1;
                neighbors.push(polygon);
              }
            });
          });
        });
      }
    }
  });

  polygons.forEach(function(polygon) {
    delete polygon._;
  });

  return {
    type: "MultiPolygon",
    arcs: groups.map(function(polygons) {
      var arcs = [], n;

      // Extract the exterior (unique) arcs.
      polygons.forEach(function(polygon) {
        polygon.forEach(function(ring) {
          ring.forEach(function(arc) {
            if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
              arcs.push(arc);
            }
          });
        });
      });

      // Stitch the arcs into one or more rings.
      arcs = stitch(topology, arcs);

      // If more than one ring is returned,
      // at most one of these rings can be the exterior;
      // choose the one with the greatest absolute area.
      if ((n = arcs.length) > 1) {
        for (var i = 1, k = area(arcs[0]), ki, t; i < n; ++i) {
          if ((ki = area(arcs[i])) > k) {
            t = arcs[0], arcs[0] = arcs[i], arcs[i] = t, k = ki;
          }
        }
      }

      return arcs;
    }).filter(function(arcs) {
      return arcs.length > 0;
    })
  };
}

function bisect(a, x) {
  var lo = 0, hi = a.length;
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function neighbors(objects) {
  var indexesByArc = {}, // arc index -> array of object indexes
      neighbors = objects.map(function() { return []; });

  function line(arcs, i) {
    arcs.forEach(function(a) {
      if (a < 0) a = ~a;
      var o = indexesByArc[a];
      if (o) o.push(i);
      else indexesByArc[a] = [i];
    });
  }

  function polygon(arcs, i) {
    arcs.forEach(function(arc) { line(arc, i); });
  }

  function geometry(o, i) {
    if (o.type === "GeometryCollection") o.geometries.forEach(function(o) { geometry(o, i); });
    else if (o.type in geometryType) geometryType[o.type](o.arcs, i);
  }

  var geometryType = {
    LineString: line,
    MultiLineString: polygon,
    Polygon: polygon,
    MultiPolygon: function(arcs, i) { arcs.forEach(function(arc) { polygon(arc, i); }); }
  };

  objects.forEach(geometry);

  for (var i in indexesByArc) {
    for (var indexes = indexesByArc[i], m = indexes.length, j = 0; j < m; ++j) {
      for (var k = j + 1; k < m; ++k) {
        var ij = indexes[j], ik = indexes[k], n;
        if ((n = neighbors[ij])[i = bisect(n, ik)] !== ik) n.splice(i, 0, ik);
        if ((n = neighbors[ik])[i = bisect(n, ij)] !== ij) n.splice(i, 0, ij);
      }
    }
  }

  return neighbors;
}

function untransform(transform) {
  if (transform == null) return identity$4;
  var x0,
      y0,
      kx = transform.scale[0],
      ky = transform.scale[1],
      dx = transform.translate[0],
      dy = transform.translate[1];
  return function(input, i) {
    if (!i) x0 = y0 = 0;
    var j = 2,
        n = input.length,
        output = new Array(n),
        x1 = Math.round((input[0] - dx) / kx),
        y1 = Math.round((input[1] - dy) / ky);
    output[0] = x1 - x0, x0 = x1;
    output[1] = y1 - y0, y0 = y1;
    while (j < n) output[j] = input[j], ++j;
    return output;
  };
}

function quantize(topology, transform) {
  if (topology.transform) throw new Error("already quantized");

  if (!transform || !transform.scale) {
    if (!((n = Math.floor(transform)) >= 2)) throw new Error("n must be ≥2");
    box = topology.bbox || bbox(topology);
    var x0 = box[0], y0 = box[1], x1 = box[2], y1 = box[3], n;
    transform = {scale: [x1 - x0 ? (x1 - x0) / (n - 1) : 1, y1 - y0 ? (y1 - y0) / (n - 1) : 1], translate: [x0, y0]};
  } else {
    box = topology.bbox;
  }

  var t = untransform(transform), box, key, inputs = topology.objects, outputs = {};

  function quantizePoint(point) {
    return t(point);
  }

  function quantizeGeometry(input) {
    var output;
    switch (input.type) {
      case "GeometryCollection": output = {type: "GeometryCollection", geometries: input.geometries.map(quantizeGeometry)}; break;
      case "Point": output = {type: "Point", coordinates: quantizePoint(input.coordinates)}; break;
      case "MultiPoint": output = {type: "MultiPoint", coordinates: input.coordinates.map(quantizePoint)}; break;
      default: return input;
    }
    if (input.id != null) output.id = input.id;
    if (input.bbox != null) output.bbox = input.bbox;
    if (input.properties != null) output.properties = input.properties;
    return output;
  }

  function quantizeArc(input) {
    var i = 0, j = 1, n = input.length, p, output = new Array(n); // pessimistic
    output[0] = t(input[0], 0);
    while (++i < n) if ((p = t(input[i], i))[0] || p[1]) output[j++] = p; // non-coincident points
    if (j === 1) output[j++] = [0, 0]; // an arc must have at least two points
    output.length = j;
    return output;
  }

  for (key in inputs) outputs[key] = quantizeGeometry(inputs[key]);

  return {
    type: "Topology",
    bbox: box,
    transform: transform,
    objects: outputs,
    arcs: topology.arcs.map(quantizeArc)
  };
}

var src$6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  bbox: bbox,
  feature: feature,
  merge: merge,
  mergeArcs: mergeArcs,
  mesh: mesh,
  meshArcs: meshArcs,
  neighbors: neighbors,
  quantize: quantize,
  transform: transform$1,
  untransform: untransform
});

var require$$3 = /*@__PURE__*/getAugmentedNamespace(src$6);

var noop$2 = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get$1(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop$2, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var frame = 0, // is an animation frame pending?
    timeout$1 = 0, // is a timeout pending?
    interval$1 = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout$1 = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval$1) interval$1 = clearInterval(interval$1);
  } else {
    if (!interval$1) clockLast = clock.now(), interval$1 = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(function(elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

function interval(callback, delay, time) {
  var t = new Timer, total = delay;
  if (delay == null) return t.restart(callback, delay, time), t;
  delay = +delay, time = time == null ? now() : +time;
  t.restart(function tick(elapsed) {
    elapsed += total;
    t.restart(tick, total += delay, time);
    callback(elapsed);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get(node, id).value[name];
  };
}

function interpolate$1(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color ? interpolateRgb
      : (c = color(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate$1;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
      : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get(this.node(), id).ease;
}

function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection = selection.prototype.constructor;

function transition_selection() {
  return new Selection(this._groups, this._parents);
}

function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = set(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$1;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant(name, i, value), priority)
      .on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction(tweenValue(this, "text", value))
      : textConstant(value == null ? "" : value + ""));
}

function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = set(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });
  });
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return selection().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  end: transition_end
};

function linear(t) {
  return +t;
}

function quadIn(t) {
  return t * t;
}

function quadOut(t) {
  return t * (2 - t);
}

function quadInOut(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}

function cubicIn(t) {
  return t * t * t;
}

function cubicOut(t) {
  return --t * t * t + 1;
}

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var exponent = 3;

var polyIn = (function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;

  return polyIn;
})(exponent);

var polyOut = (function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;

  return polyOut;
})(exponent);

var polyInOut = (function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;

  return polyInOut;
})(exponent);

var pi$3 = Math.PI,
    halfPi$2 = pi$3 / 2;

function sinIn(t) {
  return (+t === 1) ? 1 : 1 - Math.cos(t * halfPi$2);
}

function sinOut(t) {
  return Math.sin(t * halfPi$2);
}

function sinInOut(t) {
  return (1 - Math.cos(pi$3 * t)) / 2;
}

// tpmt is two power minus ten times t scaled to [0,1]
function tpmt(x) {
  return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
}

function expIn(t) {
  return tpmt(1 - +t);
}

function expOut(t) {
  return 1 - tpmt(t);
}

function expInOut(t) {
  return ((t *= 2) <= 1 ? tpmt(1 - t) : 2 - tpmt(t - 1)) / 2;
}

function circleIn(t) {
  return 1 - Math.sqrt(1 - t * t);
}

function circleOut(t) {
  return Math.sqrt(1 - --t * t);
}

function circleInOut(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}

var b1 = 4 / 11,
    b2 = 6 / 11,
    b3 = 8 / 11,
    b4 = 3 / 4,
    b5 = 9 / 11,
    b6 = 10 / 11,
    b7 = 15 / 16,
    b8 = 21 / 22,
    b9 = 63 / 64,
    b0 = 1 / b1 / b1;

function bounceIn(t) {
  return 1 - bounceOut(1 - t);
}

function bounceOut(t) {
  return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
}

function bounceInOut(t) {
  return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
}

var overshoot = 1.70158;

var backIn = (function custom(s) {
  s = +s;

  function backIn(t) {
    return (t = +t) * t * (s * (t - 1) + t);
  }

  backIn.overshoot = custom;

  return backIn;
})(overshoot);

var backOut = (function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((t + 1) * s + t) + 1;
  }

  backOut.overshoot = custom;

  return backOut;
})(overshoot);

var backInOut = (function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;

  return backInOut;
})(overshoot);

var tau$3 = 2 * Math.PI,
    amplitude = 1,
    period = 0.3;

var elasticIn = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$3);

  function elasticIn(t) {
    return a * tpmt(-(--t)) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function(a) { return custom(a, p * tau$3); };
  elasticIn.period = function(p) { return custom(a, p); };

  return elasticIn;
})(amplitude, period);

var elasticOut = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$3);

  function elasticOut(t) {
    return 1 - a * tpmt(t = +t) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function(a) { return custom(a, p * tau$3); };
  elasticOut.period = function(p) { return custom(a, p); };

  return elasticOut;
})(amplitude, period);

var elasticInOut = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$3);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0
        ? a * tpmt(-t) * Math.sin((s - t) / p)
        : 2 - a * tpmt(t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function(a) { return custom(a, p * tau$3); };
  elasticInOut.period = function(p) { return custom(a, p); };

  return elasticInOut;
})(amplitude, period);

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = now(), defaultTiming;
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

var root = [null];

function active(node, name) {
  var schedules = node.__transition,
      schedule,
      i;

  if (schedules) {
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
        return new Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}

var src$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  active: active,
  interrupt: interrupt,
  transition: transition
});

var require$$4 = /*@__PURE__*/getAugmentedNamespace(src$5);

var require$$1 = /*@__PURE__*/getAugmentedNamespace(src$9);

var require$$6 = /*@__PURE__*/getAugmentedNamespace(src$7);

function nopropagation$1() {
  event.stopImmediatePropagation();
}

function noevent$1() {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function dragDisable(view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent$1, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent$1, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent$1, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

function constant$3(x) {
  return function() {
    return x;
  };
}

function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
  this.target = target;
  this.type = type;
  this.subject = subject;
  this.identifier = id;
  this.active = active;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch;
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// Ignore right-click, since that should open the context menu.
function defaultFilter$1() {
  return !event.ctrlKey && !event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(d) {
  return d == null ? {x: event.x, y: event.y} : d;
}

function defaultTouchable$1() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function drag() {
  var filter = defaultFilter$1,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable$1,
      gestures = {},
      listeners = dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var gesture = beforestart("mouse", container.apply(this, arguments), mouse, this, arguments);
    if (!gesture) return;
    select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    dragDisable(event.view);
    nopropagation$1();
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start");
  }

  function mousemoved() {
    noevent$1();
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag");
  }

  function mouseupped() {
    select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent$1();
    gestures.mouse("end");
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = event.changedTouches,
        c = container.apply(this, arguments),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(touches[i].identifier, c, touch, this, arguments)) {
        nopropagation$1();
        gesture("start");
      }
    }
  }

  function touchmoved() {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent$1();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation$1();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id), s, dx, dy,
        sublisteners = listeners.copy();

    if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
      if ((event.subject = s = subject.apply(that, args)) == null) return false;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;

    return function gesture(type) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[id] = gesture, n = active++; break;
        case "end": delete gestures[id], --active; // nobreak
        case "drag": p = point(container, id), n = active; break;
      }
      customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$3(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant$3(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$3(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$3(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}

function constant$2(x) {
  return function() {
    return x;
  };
}

function BrushEvent(target, type, selection) {
  this.target = target;
  this.type = type;
  this.selection = selection;
}

function nopropagation() {
  event.stopImmediatePropagation();
}

function noevent() {
  event.preventDefault();
  event.stopImmediatePropagation();
}

var MODE_DRAG = {name: "drag"},
    MODE_SPACE = {name: "space"},
    MODE_HANDLE = {name: "handle"},
    MODE_CENTER = {name: "center"};

function number1(e) {
  return [+e[0], +e[1]];
}

function number2(e) {
  return [number1(e[0]), number1(e[1])];
}

function toucher(identifier) {
  return function(target) {
    return touch(target, event.touches, identifier);
  };
}

var X = {
  name: "x",
  handles: ["w", "e"].map(type),
  input: function(x, e) { return x == null ? null : [[+x[0], e[0][1]], [+x[1], e[1][1]]]; },
  output: function(xy) { return xy && [xy[0][0], xy[1][0]]; }
};

var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function(y, e) { return y == null ? null : [[e[0][0], +y[0]], [e[1][0], +y[1]]]; },
  output: function(xy) { return xy && [xy[0][1], xy[1][1]]; }
};

var XY = {
  name: "xy",
  handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
  input: function(xy) { return xy == null ? null : number2(xy); },
  output: function(xy) { return xy; }
};

var cursors = {
  overlay: "crosshair",
  selection: "move",
  n: "ns-resize",
  e: "ew-resize",
  s: "ns-resize",
  w: "ew-resize",
  nw: "nwse-resize",
  ne: "nesw-resize",
  se: "nwse-resize",
  sw: "nesw-resize"
};

var flipX = {
  e: "w",
  w: "e",
  nw: "ne",
  ne: "nw",
  se: "sw",
  sw: "se"
};

var flipY = {
  n: "s",
  s: "n",
  nw: "sw",
  ne: "se",
  se: "ne",
  sw: "nw"
};

var signsX = {
  overlay: +1,
  selection: +1,
  n: null,
  e: +1,
  s: null,
  w: -1,
  nw: -1,
  ne: +1,
  se: +1,
  sw: -1
};

var signsY = {
  overlay: +1,
  selection: +1,
  n: -1,
  e: null,
  s: +1,
  w: null,
  nw: -1,
  ne: -1,
  se: +1,
  sw: +1
};

function type(t) {
  return {type: t};
}

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !event.ctrlKey && !event.button;
}

function defaultExtent() {
  var svg = this.ownerSVGElement || this;
  if (svg.hasAttribute("viewBox")) {
    svg = svg.viewBox.baseVal;
    return [[svg.x, svg.y], [svg.x + svg.width, svg.y + svg.height]];
  }
  return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

// Like d3.local, but with the name “__brush” rather than auto-generated.
function local(node) {
  while (!node.__brush) if (!(node = node.parentNode)) return;
  return node.__brush;
}

function empty(extent) {
  return extent[0][0] === extent[1][0]
      || extent[0][1] === extent[1][1];
}

function brushSelection(node) {
  var state = node.__brush;
  return state ? state.dim.output(state.selection) : null;
}

function brushX() {
  return brush$1(X);
}

function brushY() {
  return brush$1(Y);
}

function brush() {
  return brush$1(XY);
}

function brush$1(dim) {
  var extent = defaultExtent,
      filter = defaultFilter,
      touchable = defaultTouchable,
      keys = true,
      listeners = dispatch("start", "brush", "end"),
      handleSize = 6,
      touchending;

  function brush(group) {
    var overlay = group
        .property("__brush", initialize)
      .selectAll(".overlay")
      .data([type("overlay")]);

    overlay.enter().append("rect")
        .attr("class", "overlay")
        .attr("pointer-events", "all")
        .attr("cursor", cursors.overlay)
      .merge(overlay)
        .each(function() {
          var extent = local(this).extent;
          select(this)
              .attr("x", extent[0][0])
              .attr("y", extent[0][1])
              .attr("width", extent[1][0] - extent[0][0])
              .attr("height", extent[1][1] - extent[0][1]);
        });

    group.selectAll(".selection")
      .data([type("selection")])
      .enter().append("rect")
        .attr("class", "selection")
        .attr("cursor", cursors.selection)
        .attr("fill", "#777")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "#fff")
        .attr("shape-rendering", "crispEdges");

    var handle = group.selectAll(".handle")
      .data(dim.handles, function(d) { return d.type; });

    handle.exit().remove();

    handle.enter().append("rect")
        .attr("class", function(d) { return "handle handle--" + d.type; })
        .attr("cursor", function(d) { return cursors[d.type]; });

    group
        .each(redraw)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mousedown.brush", started)
      .filter(touchable)
        .on("touchstart.brush", started)
        .on("touchmove.brush", touchmoved)
        .on("touchend.brush touchcancel.brush", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  brush.move = function(group, selection) {
    if (group.selection) {
      group
          .on("start.brush", function() { emitter(this, arguments).beforestart().start(); })
          .on("interrupt.brush end.brush", function() { emitter(this, arguments).end(); })
          .tween("brush", function() {
            var that = this,
                state = that.__brush,
                emit = emitter(that, arguments),
                selection0 = state.selection,
                selection1 = dim.input(typeof selection === "function" ? selection.apply(this, arguments) : selection, state.extent),
                i = interpolate$2(selection0, selection1);

            function tween(t) {
              state.selection = t === 1 && selection1 === null ? null : i(t);
              redraw.call(that);
              emit.brush();
            }

            return selection0 !== null && selection1 !== null ? tween : tween(1);
          });
    } else {
      group
          .each(function() {
            var that = this,
                args = arguments,
                state = that.__brush,
                selection1 = dim.input(typeof selection === "function" ? selection.apply(that, args) : selection, state.extent),
                emit = emitter(that, args).beforestart();

            interrupt(that);
            state.selection = selection1 === null ? null : selection1;
            redraw.call(that);
            emit.start().brush().end();
          });
    }
  };

  brush.clear = function(group) {
    brush.move(group, null);
  };

  function redraw() {
    var group = select(this),
        selection = local(this).selection;

    if (selection) {
      group.selectAll(".selection")
          .style("display", null)
          .attr("x", selection[0][0])
          .attr("y", selection[0][1])
          .attr("width", selection[1][0] - selection[0][0])
          .attr("height", selection[1][1] - selection[0][1]);

      group.selectAll(".handle")
          .style("display", null)
          .attr("x", function(d) { return d.type[d.type.length - 1] === "e" ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2; })
          .attr("y", function(d) { return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2; })
          .attr("width", function(d) { return d.type === "n" || d.type === "s" ? selection[1][0] - selection[0][0] + handleSize : handleSize; })
          .attr("height", function(d) { return d.type === "e" || d.type === "w" ? selection[1][1] - selection[0][1] + handleSize : handleSize; });
    }

    else {
      group.selectAll(".selection,.handle")
          .style("display", "none")
          .attr("x", null)
          .attr("y", null)
          .attr("width", null)
          .attr("height", null);
    }
  }

  function emitter(that, args, clean) {
    var emit = that.__brush.emitter;
    return emit && (!clean || !emit.clean) ? emit : new Emitter(that, args, clean);
  }

  function Emitter(that, args, clean) {
    this.that = that;
    this.args = args;
    this.state = that.__brush;
    this.active = 0;
    this.clean = clean;
  }

  Emitter.prototype = {
    beforestart: function() {
      if (++this.active === 1) this.state.emitter = this, this.starting = true;
      return this;
    },
    start: function() {
      if (this.starting) this.starting = false, this.emit("start");
      else this.emit("brush");
      return this;
    },
    brush: function() {
      this.emit("brush");
      return this;
    },
    end: function() {
      if (--this.active === 0) delete this.state.emitter, this.emit("end");
      return this;
    },
    emit: function(type) {
      customEvent(new BrushEvent(brush, type, dim.output(this.state.selection)), listeners.apply, listeners, [type, this.that, this.args]);
    }
  };

  function started() {
    if (touchending && !event.touches) return;
    if (!filter.apply(this, arguments)) return;

    var that = this,
        type = event.target.__data__.type,
        mode = (keys && event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : (keys && event.altKey ? MODE_CENTER : MODE_HANDLE),
        signX = dim === Y ? null : signsX[type],
        signY = dim === X ? null : signsY[type],
        state = local(that),
        extent = state.extent,
        selection = state.selection,
        W = extent[0][0], w0, w1,
        N = extent[0][1], n0, n1,
        E = extent[1][0], e0, e1,
        S = extent[1][1], s0, s1,
        dx = 0,
        dy = 0,
        moving,
        shifting = signX && signY && keys && event.shiftKey,
        lockX,
        lockY,
        pointer = event.touches ? toucher(event.changedTouches[0].identifier) : mouse,
        point0 = pointer(that),
        point = point0,
        emit = emitter(that, arguments, true).beforestart();

    if (type === "overlay") {
      if (selection) moving = true;
      state.selection = selection = [
        [w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]],
        [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]
      ];
    } else {
      w0 = selection[0][0];
      n0 = selection[0][1];
      e0 = selection[1][0];
      s0 = selection[1][1];
    }

    w1 = w0;
    n1 = n0;
    e1 = e0;
    s1 = s0;

    var group = select(that)
        .attr("pointer-events", "none");

    var overlay = group.selectAll(".overlay")
        .attr("cursor", cursors[type]);

    if (event.touches) {
      emit.moved = moved;
      emit.ended = ended;
    } else {
      var view = select(event.view)
          .on("mousemove.brush", moved, true)
          .on("mouseup.brush", ended, true);
      if (keys) view
          .on("keydown.brush", keydowned, true)
          .on("keyup.brush", keyupped, true);

      dragDisable(event.view);
    }

    nopropagation();
    interrupt(that);
    redraw.call(that);
    emit.start();

    function moved() {
      var point1 = pointer(that);
      if (shifting && !lockX && !lockY) {
        if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;
        else lockX = true;
      }
      point = point1;
      moving = true;
      noevent();
      move();
    }

    function move() {
      var t;

      dx = point[0] - point0[0];
      dy = point[1] - point0[1];

      switch (mode) {
        case MODE_SPACE:
        case MODE_DRAG: {
          if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
          if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
          break;
        }
        case MODE_HANDLE: {
          if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
          else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
          if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
          else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
          break;
        }
        case MODE_CENTER: {
          if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
          if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
          break;
        }
      }

      if (e1 < w1) {
        signX *= -1;
        t = w0, w0 = e0, e0 = t;
        t = w1, w1 = e1, e1 = t;
        if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
      }

      if (s1 < n1) {
        signY *= -1;
        t = n0, n0 = s0, s0 = t;
        t = n1, n1 = s1, s1 = t;
        if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
      }

      if (state.selection) selection = state.selection; // May be set by brush.move!
      if (lockX) w1 = selection[0][0], e1 = selection[1][0];
      if (lockY) n1 = selection[0][1], s1 = selection[1][1];

      if (selection[0][0] !== w1
          || selection[0][1] !== n1
          || selection[1][0] !== e1
          || selection[1][1] !== s1) {
        state.selection = [[w1, n1], [e1, s1]];
        redraw.call(that);
        emit.brush();
      }
    }

    function ended() {
      nopropagation();
      if (event.touches) {
        if (event.touches.length) return;
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
      } else {
        yesdrag(event.view, moving);
        view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
      }
      group.attr("pointer-events", "all");
      overlay.attr("cursor", cursors.overlay);
      if (state.selection) selection = state.selection; // May be set by brush.move (on start)!
      if (empty(selection)) state.selection = null, redraw.call(that);
      emit.end();
    }

    function keydowned() {
      switch (event.keyCode) {
        case 16: { // SHIFT
          shifting = signX && signY;
          break;
        }
        case 18: { // ALT
          if (mode === MODE_HANDLE) {
            if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
            if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
            mode = MODE_CENTER;
            move();
          }
          break;
        }
        case 32: { // SPACE; takes priority over ALT
          if (mode === MODE_HANDLE || mode === MODE_CENTER) {
            if (signX < 0) e0 = e1 - dx; else if (signX > 0) w0 = w1 - dx;
            if (signY < 0) s0 = s1 - dy; else if (signY > 0) n0 = n1 - dy;
            mode = MODE_SPACE;
            overlay.attr("cursor", cursors.selection);
            move();
          }
          break;
        }
        default: return;
      }
      noevent();
    }

    function keyupped() {
      switch (event.keyCode) {
        case 16: { // SHIFT
          if (shifting) {
            lockX = lockY = shifting = false;
            move();
          }
          break;
        }
        case 18: { // ALT
          if (mode === MODE_CENTER) {
            if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
            if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
            mode = MODE_HANDLE;
            move();
          }
          break;
        }
        case 32: { // SPACE
          if (mode === MODE_SPACE) {
            if (event.altKey) {
              if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
              if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
              mode = MODE_CENTER;
            } else {
              if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
              if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
              mode = MODE_HANDLE;
            }
            overlay.attr("cursor", cursors[type]);
            move();
          }
          break;
        }
        default: return;
      }
      noevent();
    }
  }

  function touchmoved() {
    emitter(this, arguments).moved();
  }

  function touchended() {
    emitter(this, arguments).ended();
  }

  function initialize() {
    var state = this.__brush || {selection: null};
    state.extent = number2(extent.apply(this, arguments));
    state.dim = dim;
    return state;
  }

  brush.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$2(number2(_)), brush) : extent;
  };

  brush.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$2(!!_), brush) : filter;
  };

  brush.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$2(!!_), brush) : touchable;
  };

  brush.handleSize = function(_) {
    return arguments.length ? (handleSize = +_, brush) : handleSize;
  };

  brush.keyModifiers = function(_) {
    return arguments.length ? (keys = !!_, brush) : keys;
  };

  brush.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? brush : value;
  };

  return brush;
}

var src$4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  brush: brush,
  brushSelection: brushSelection,
  brushX: brushX,
  brushY: brushY
});

var require$$7 = /*@__PURE__*/getAugmentedNamespace(src$4);

var require$$8 = /*@__PURE__*/getAugmentedNamespace(src$a);

var slice$1 = Array.prototype.slice;

function identity$3(x) {
  return x;
}

var top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon$3 = 1e-6;

function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

function number(scale) {
  return function(d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return +scale(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      k = orient === top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$3) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        range0 = +range[0] + 0.5,
        range1 = +range[range.length - 1] + 0.5,
        position = (scale.bandwidth ? center : number)(scale.copy()),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");

    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
          .attr("opacity", epsilon$3)
          .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", epsilon$3)
          .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient == right
            ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
            : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1));

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position(d)); });

    line
        .attr(x + "2", k * tickSizeInner);

    text
        .attr(x, k * spacing)
        .text(format);

    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function() {
    return tickArguments = slice$1.call(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : slice$1.call(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : slice$1.call(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  return axis;
}

function axisTop(scale) {
  return axis(top, scale);
}

function axisRight(scale) {
  return axis(right, scale);
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

var src$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  axisBottom: axisBottom,
  axisLeft: axisLeft,
  axisRight: axisRight,
  axisTop: axisTop
});

var require$$9 = /*@__PURE__*/getAugmentedNamespace(src$3);

// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/

function adder() {
  return new Adder;
}

function Adder() {
  this.reset();
}

Adder.prototype = {
  constructor: Adder,
  reset: function() {
    this.s = // rounded value
    this.t = 0; // exact error
  },
  add: function(y) {
    add$1(temp, y, this.t);
    add$1(this, temp.s, this.s);
    if (this.s) this.t += temp.t;
    else this.s = temp.t;
  },
  valueOf: function() {
    return this.s;
  }
};

var temp = new Adder;

function add$1(adder, a, b) {
  var x = adder.s = a + b,
      bv = x - a,
      av = x - bv;
  adder.t = (a - av) + (b - bv);
}

var epsilon$2 = 1e-6;
var epsilon2 = 1e-12;
var pi$2 = Math.PI;
var halfPi$1 = pi$2 / 2;
var quarterPi = pi$2 / 4;
var tau$2 = pi$2 * 2;

var degrees = 180 / pi$2;
var radians = pi$2 / 180;

var abs$1 = Math.abs;
var atan = Math.atan;
var atan2$1 = Math.atan2;
var cos$1 = Math.cos;
var ceil = Math.ceil;
var exp = Math.exp;
var floor = Math.floor;
var log = Math.log;
var pow = Math.pow;
var sin$1 = Math.sin;
var sign$1 = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
var sqrt$1 = Math.sqrt;
var tan = Math.tan;

function acos$1(x) {
  return x > 1 ? 0 : x < -1 ? pi$2 : Math.acos(x);
}

function asin$1(x) {
  return x > 1 ? halfPi$1 : x < -1 ? -halfPi$1 : Math.asin(x);
}

function haversin(x) {
  return (x = sin$1(x / 2)) * x;
}

function noop$1() {}

function streamGeometry(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
}

var streamObjectType = {
  Feature: function(object, stream) {
    streamGeometry(object.geometry, stream);
  },
  FeatureCollection: function(object, stream) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) streamGeometry(features[i].geometry, stream);
  }
};

var streamGeometryType = {
  Sphere: function(object, stream) {
    stream.sphere();
  },
  Point: function(object, stream) {
    object = object.coordinates;
    stream.point(object[0], object[1], object[2]);
  },
  MultiPoint: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
  },
  LineString: function(object, stream) {
    streamLine(object.coordinates, stream, 0);
  },
  MultiLineString: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamLine(coordinates[i], stream, 0);
  },
  Polygon: function(object, stream) {
    streamPolygon(object.coordinates, stream);
  },
  MultiPolygon: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamPolygon(coordinates[i], stream);
  },
  GeometryCollection: function(object, stream) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) streamGeometry(geometries[i], stream);
  }
};

function streamLine(coordinates, stream, closed) {
  var i = -1, n = coordinates.length - closed, coordinate;
  stream.lineStart();
  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
  stream.lineEnd();
}

function streamPolygon(coordinates, stream) {
  var i = -1, n = coordinates.length;
  stream.polygonStart();
  while (++i < n) streamLine(coordinates[i], stream, 1);
  stream.polygonEnd();
}

function geoStream(object, stream) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, stream);
  } else {
    streamGeometry(object, stream);
  }
}

var areaRingSum$1 = adder();

var areaSum$1 = adder(),
    lambda00$2,
    phi00$2,
    lambda0$2,
    cosPhi0$1,
    sinPhi0$1;

var areaStream$1 = {
  point: noop$1,
  lineStart: noop$1,
  lineEnd: noop$1,
  polygonStart: function() {
    areaRingSum$1.reset();
    areaStream$1.lineStart = areaRingStart$1;
    areaStream$1.lineEnd = areaRingEnd$1;
  },
  polygonEnd: function() {
    var areaRing = +areaRingSum$1;
    areaSum$1.add(areaRing < 0 ? tau$2 + areaRing : areaRing);
    this.lineStart = this.lineEnd = this.point = noop$1;
  },
  sphere: function() {
    areaSum$1.add(tau$2);
  }
};

function areaRingStart$1() {
  areaStream$1.point = areaPointFirst$1;
}

function areaRingEnd$1() {
  areaPoint$1(lambda00$2, phi00$2);
}

function areaPointFirst$1(lambda, phi) {
  areaStream$1.point = areaPoint$1;
  lambda00$2 = lambda, phi00$2 = phi;
  lambda *= radians, phi *= radians;
  lambda0$2 = lambda, cosPhi0$1 = cos$1(phi = phi / 2 + quarterPi), sinPhi0$1 = sin$1(phi);
}

function areaPoint$1(lambda, phi) {
  lambda *= radians, phi *= radians;
  phi = phi / 2 + quarterPi; // half the angular distance from south pole

  // Spherical excess E for a spherical triangle with vertices: south pole,
  // previous point, current point.  Uses a formula derived from Cagnoli’s
  // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
  var dLambda = lambda - lambda0$2,
      sdLambda = dLambda >= 0 ? 1 : -1,
      adLambda = sdLambda * dLambda,
      cosPhi = cos$1(phi),
      sinPhi = sin$1(phi),
      k = sinPhi0$1 * sinPhi,
      u = cosPhi0$1 * cosPhi + k * cos$1(adLambda),
      v = k * sdLambda * sin$1(adLambda);
  areaRingSum$1.add(atan2$1(v, u));

  // Advance the previous points.
  lambda0$2 = lambda, cosPhi0$1 = cosPhi, sinPhi0$1 = sinPhi;
}

function area$1(object) {
  areaSum$1.reset();
  geoStream(object, areaStream$1);
  return areaSum$1 * 2;
}

function spherical(cartesian) {
  return [atan2$1(cartesian[1], cartesian[0]), asin$1(cartesian[2])];
}

function cartesian(spherical) {
  var lambda = spherical[0], phi = spherical[1], cosPhi = cos$1(phi);
  return [cosPhi * cos$1(lambda), cosPhi * sin$1(lambda), sin$1(phi)];
}

function cartesianDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cartesianCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

// TODO return a
function cartesianAddInPlace(a, b) {
  a[0] += b[0], a[1] += b[1], a[2] += b[2];
}

function cartesianScale(vector, k) {
  return [vector[0] * k, vector[1] * k, vector[2] * k];
}

// TODO return d
function cartesianNormalizeInPlace(d) {
  var l = sqrt$1(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  d[0] /= l, d[1] /= l, d[2] /= l;
}

var lambda0$1, phi0, lambda1, phi1, // bounds
    lambda2, // previous lambda-coordinate
    lambda00$1, phi00$1, // first point
    p0, // previous 3D point
    deltaSum = adder(),
    ranges,
    range;

var boundsStream$1 = {
  point: boundsPoint$1,
  lineStart: boundsLineStart,
  lineEnd: boundsLineEnd,
  polygonStart: function() {
    boundsStream$1.point = boundsRingPoint;
    boundsStream$1.lineStart = boundsRingStart;
    boundsStream$1.lineEnd = boundsRingEnd;
    deltaSum.reset();
    areaStream$1.polygonStart();
  },
  polygonEnd: function() {
    areaStream$1.polygonEnd();
    boundsStream$1.point = boundsPoint$1;
    boundsStream$1.lineStart = boundsLineStart;
    boundsStream$1.lineEnd = boundsLineEnd;
    if (areaRingSum$1 < 0) lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
    else if (deltaSum > epsilon$2) phi1 = 90;
    else if (deltaSum < -epsilon$2) phi0 = -90;
    range[0] = lambda0$1, range[1] = lambda1;
  },
  sphere: function() {
    lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
  }
};

function boundsPoint$1(lambda, phi) {
  ranges.push(range = [lambda0$1 = lambda, lambda1 = lambda]);
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
}

function linePoint(lambda, phi) {
  var p = cartesian([lambda * radians, phi * radians]);
  if (p0) {
    var normal = cartesianCross(p0, p),
        equatorial = [normal[1], -normal[0], 0],
        inflection = cartesianCross(equatorial, normal);
    cartesianNormalizeInPlace(inflection);
    inflection = spherical(inflection);
    var delta = lambda - lambda2,
        sign = delta > 0 ? 1 : -1,
        lambdai = inflection[0] * degrees * sign,
        phii,
        antimeridian = abs$1(delta) > 180;
    if (antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
      phii = inflection[1] * degrees;
      if (phii > phi1) phi1 = phii;
    } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
      phii = -inflection[1] * degrees;
      if (phii < phi0) phi0 = phii;
    } else {
      if (phi < phi0) phi0 = phi;
      if (phi > phi1) phi1 = phi;
    }
    if (antimeridian) {
      if (lambda < lambda2) {
        if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
      } else {
        if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
      }
    } else {
      if (lambda1 >= lambda0$1) {
        if (lambda < lambda0$1) lambda0$1 = lambda;
        if (lambda > lambda1) lambda1 = lambda;
      } else {
        if (lambda > lambda2) {
          if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
        } else {
          if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
        }
      }
    }
  } else {
    ranges.push(range = [lambda0$1 = lambda, lambda1 = lambda]);
  }
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
  p0 = p, lambda2 = lambda;
}

function boundsLineStart() {
  boundsStream$1.point = linePoint;
}

function boundsLineEnd() {
  range[0] = lambda0$1, range[1] = lambda1;
  boundsStream$1.point = boundsPoint$1;
  p0 = null;
}

function boundsRingPoint(lambda, phi) {
  if (p0) {
    var delta = lambda - lambda2;
    deltaSum.add(abs$1(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
  } else {
    lambda00$1 = lambda, phi00$1 = phi;
  }
  areaStream$1.point(lambda, phi);
  linePoint(lambda, phi);
}

function boundsRingStart() {
  areaStream$1.lineStart();
}

function boundsRingEnd() {
  boundsRingPoint(lambda00$1, phi00$1);
  areaStream$1.lineEnd();
  if (abs$1(deltaSum) > epsilon$2) lambda0$1 = -(lambda1 = 180);
  range[0] = lambda0$1, range[1] = lambda1;
  p0 = null;
}

// Finds the left-right distance between two longitudes.
// This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
// the distance between ±180° to be 360°.
function angle(lambda0, lambda1) {
  return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
}

function rangeCompare(a, b) {
  return a[0] - b[0];
}

function rangeContains(range, x) {
  return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
}

function bounds(feature) {
  var i, n, a, b, merged, deltaMax, delta;

  phi1 = lambda1 = -(lambda0$1 = phi0 = Infinity);
  ranges = [];
  geoStream(feature, boundsStream$1);

  // First, sort ranges by their minimum longitudes.
  if (n = ranges.length) {
    ranges.sort(rangeCompare);

    // Then, merge any ranges that overlap.
    for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) {
      b = ranges[i];
      if (rangeContains(a, b[0]) || rangeContains(a, b[1])) {
        if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
        if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
      } else {
        merged.push(a = b);
      }
    }

    // Finally, find the largest gap between the merged ranges.
    // The final bounding box will be the inverse of this gap.
    for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) {
      b = merged[i];
      if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0$1 = b[0], lambda1 = a[1];
    }
  }

  ranges = range = null;

  return lambda0$1 === Infinity || phi0 === Infinity
      ? [[NaN, NaN], [NaN, NaN]]
      : [[lambda0$1, phi0], [lambda1, phi1]];
}

var W0, W1,
    X0$1, Y0$1, Z0$1,
    X1$1, Y1$1, Z1$1,
    X2$1, Y2$1, Z2$1,
    lambda00, phi00, // first point
    x0$4, y0$4, z0; // previous point

var centroidStream$1 = {
  sphere: noop$1,
  point: centroidPoint$1,
  lineStart: centroidLineStart$1,
  lineEnd: centroidLineEnd$1,
  polygonStart: function() {
    centroidStream$1.lineStart = centroidRingStart$1;
    centroidStream$1.lineEnd = centroidRingEnd$1;
  },
  polygonEnd: function() {
    centroidStream$1.lineStart = centroidLineStart$1;
    centroidStream$1.lineEnd = centroidLineEnd$1;
  }
};

// Arithmetic mean of Cartesian vectors.
function centroidPoint$1(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos$1(phi);
  centroidPointCartesian(cosPhi * cos$1(lambda), cosPhi * sin$1(lambda), sin$1(phi));
}

function centroidPointCartesian(x, y, z) {
  ++W0;
  X0$1 += (x - X0$1) / W0;
  Y0$1 += (y - Y0$1) / W0;
  Z0$1 += (z - Z0$1) / W0;
}

function centroidLineStart$1() {
  centroidStream$1.point = centroidLinePointFirst;
}

function centroidLinePointFirst(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos$1(phi);
  x0$4 = cosPhi * cos$1(lambda);
  y0$4 = cosPhi * sin$1(lambda);
  z0 = sin$1(phi);
  centroidStream$1.point = centroidLinePoint;
  centroidPointCartesian(x0$4, y0$4, z0);
}

function centroidLinePoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos$1(phi),
      x = cosPhi * cos$1(lambda),
      y = cosPhi * sin$1(lambda),
      z = sin$1(phi),
      w = atan2$1(sqrt$1((w = y0$4 * z - z0 * y) * w + (w = z0 * x - x0$4 * z) * w + (w = x0$4 * y - y0$4 * x) * w), x0$4 * x + y0$4 * y + z0 * z);
  W1 += w;
  X1$1 += w * (x0$4 + (x0$4 = x));
  Y1$1 += w * (y0$4 + (y0$4 = y));
  Z1$1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0$4, y0$4, z0);
}

function centroidLineEnd$1() {
  centroidStream$1.point = centroidPoint$1;
}

// See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
// J. Applied Mechanics 42, 239 (1975).
function centroidRingStart$1() {
  centroidStream$1.point = centroidRingPointFirst;
}

function centroidRingEnd$1() {
  centroidRingPoint(lambda00, phi00);
  centroidStream$1.point = centroidPoint$1;
}

function centroidRingPointFirst(lambda, phi) {
  lambda00 = lambda, phi00 = phi;
  lambda *= radians, phi *= radians;
  centroidStream$1.point = centroidRingPoint;
  var cosPhi = cos$1(phi);
  x0$4 = cosPhi * cos$1(lambda);
  y0$4 = cosPhi * sin$1(lambda);
  z0 = sin$1(phi);
  centroidPointCartesian(x0$4, y0$4, z0);
}

function centroidRingPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos$1(phi),
      x = cosPhi * cos$1(lambda),
      y = cosPhi * sin$1(lambda),
      z = sin$1(phi),
      cx = y0$4 * z - z0 * y,
      cy = z0 * x - x0$4 * z,
      cz = x0$4 * y - y0$4 * x,
      m = sqrt$1(cx * cx + cy * cy + cz * cz),
      w = asin$1(m), // line weight = angle
      v = m && -w / m; // area weight multiplier
  X2$1 += v * cx;
  Y2$1 += v * cy;
  Z2$1 += v * cz;
  W1 += w;
  X1$1 += w * (x0$4 + (x0$4 = x));
  Y1$1 += w * (y0$4 + (y0$4 = y));
  Z1$1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0$4, y0$4, z0);
}

function centroid(object) {
  W0 = W1 =
  X0$1 = Y0$1 = Z0$1 =
  X1$1 = Y1$1 = Z1$1 =
  X2$1 = Y2$1 = Z2$1 = 0;
  geoStream(object, centroidStream$1);

  var x = X2$1,
      y = Y2$1,
      z = Z2$1,
      m = x * x + y * y + z * z;

  // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
  if (m < epsilon2) {
    x = X1$1, y = Y1$1, z = Z1$1;
    // If the feature has zero length, fall back to arithmetic mean of point vectors.
    if (W1 < epsilon$2) x = X0$1, y = Y0$1, z = Z0$1;
    m = x * x + y * y + z * z;
    // If the feature still has an undefined ccentroid, then return.
    if (m < epsilon2) return [NaN, NaN];
  }

  return [atan2$1(y, x) * degrees, asin$1(z / sqrt$1(m)) * degrees];
}

function constant$1(x) {
  return function() {
    return x;
  };
}

function compose(a, b) {

  function compose(x, y) {
    return x = a(x, y), b(x[0], x[1]);
  }

  if (a.invert && b.invert) compose.invert = function(x, y) {
    return x = b.invert(x, y), x && a.invert(x[0], x[1]);
  };

  return compose;
}

function rotationIdentity(lambda, phi) {
  return [abs$1(lambda) > pi$2 ? lambda + Math.round(-lambda / tau$2) * tau$2 : lambda, phi];
}

rotationIdentity.invert = rotationIdentity;

function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
  return (deltaLambda %= tau$2) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
    : rotationLambda(deltaLambda))
    : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
    : rotationIdentity);
}

function forwardRotationLambda(deltaLambda) {
  return function(lambda, phi) {
    return lambda += deltaLambda, [lambda > pi$2 ? lambda - tau$2 : lambda < -pi$2 ? lambda + tau$2 : lambda, phi];
  };
}

function rotationLambda(deltaLambda) {
  var rotation = forwardRotationLambda(deltaLambda);
  rotation.invert = forwardRotationLambda(-deltaLambda);
  return rotation;
}

function rotationPhiGamma(deltaPhi, deltaGamma) {
  var cosDeltaPhi = cos$1(deltaPhi),
      sinDeltaPhi = sin$1(deltaPhi),
      cosDeltaGamma = cos$1(deltaGamma),
      sinDeltaGamma = sin$1(deltaGamma);

  function rotation(lambda, phi) {
    var cosPhi = cos$1(phi),
        x = cos$1(lambda) * cosPhi,
        y = sin$1(lambda) * cosPhi,
        z = sin$1(phi),
        k = z * cosDeltaPhi + x * sinDeltaPhi;
    return [
      atan2$1(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
      asin$1(k * cosDeltaGamma + y * sinDeltaGamma)
    ];
  }

  rotation.invert = function(lambda, phi) {
    var cosPhi = cos$1(phi),
        x = cos$1(lambda) * cosPhi,
        y = sin$1(lambda) * cosPhi,
        z = sin$1(phi),
        k = z * cosDeltaGamma - y * sinDeltaGamma;
    return [
      atan2$1(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
      asin$1(k * cosDeltaPhi - x * sinDeltaPhi)
    ];
  };

  return rotation;
}

function rotation(rotate) {
  rotate = rotateRadians(rotate[0] * radians, rotate[1] * radians, rotate.length > 2 ? rotate[2] * radians : 0);

  function forward(coordinates) {
    coordinates = rotate(coordinates[0] * radians, coordinates[1] * radians);
    return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
  }

  forward.invert = function(coordinates) {
    coordinates = rotate.invert(coordinates[0] * radians, coordinates[1] * radians);
    return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
  };

  return forward;
}

// Generates a circle centered at [0°, 0°], with a given radius and precision.
function circleStream(stream, radius, delta, direction, t0, t1) {
  if (!delta) return;
  var cosRadius = cos$1(radius),
      sinRadius = sin$1(radius),
      step = direction * delta;
  if (t0 == null) {
    t0 = radius + direction * tau$2;
    t1 = radius - step / 2;
  } else {
    t0 = circleRadius(cosRadius, t0);
    t1 = circleRadius(cosRadius, t1);
    if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau$2;
  }
  for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
    point = spherical([cosRadius, -sinRadius * cos$1(t), -sinRadius * sin$1(t)]);
    stream.point(point[0], point[1]);
  }
}

// Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
function circleRadius(cosRadius, point) {
  point = cartesian(point), point[0] -= cosRadius;
  cartesianNormalizeInPlace(point);
  var radius = acos$1(-point[1]);
  return ((-point[2] < 0 ? -radius : radius) + tau$2 - epsilon$2) % tau$2;
}

function circle$2() {
  var center = constant$1([0, 0]),
      radius = constant$1(90),
      precision = constant$1(6),
      ring,
      rotate,
      stream = {point: point};

  function point(x, y) {
    ring.push(x = rotate(x, y));
    x[0] *= degrees, x[1] *= degrees;
  }

  function circle() {
    var c = center.apply(this, arguments),
        r = radius.apply(this, arguments) * radians,
        p = precision.apply(this, arguments) * radians;
    ring = [];
    rotate = rotateRadians(-c[0] * radians, -c[1] * radians, 0).invert;
    circleStream(stream, r, p, 1);
    c = {type: "Polygon", coordinates: [ring]};
    ring = rotate = null;
    return c;
  }

  circle.center = function(_) {
    return arguments.length ? (center = typeof _ === "function" ? _ : constant$1([+_[0], +_[1]]), circle) : center;
  };

  circle.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$1(+_), circle) : radius;
  };

  circle.precision = function(_) {
    return arguments.length ? (precision = typeof _ === "function" ? _ : constant$1(+_), circle) : precision;
  };

  return circle;
}

function clipBuffer() {
  var lines = [],
      line;
  return {
    point: function(x, y, m) {
      line.push([x, y, m]);
    },
    lineStart: function() {
      lines.push(line = []);
    },
    lineEnd: noop$1,
    rejoin: function() {
      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
    },
    result: function() {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
}

function pointEqual(a, b) {
  return abs$1(a[0] - b[0]) < epsilon$2 && abs$1(a[1] - b[1]) < epsilon$2;
}

function Intersection(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other; // another intersection
  this.e = entry; // is an entry?
  this.v = false; // visited
  this.n = this.p = null; // next & previous
}

// A generalized polygon clipping algorithm: given a polygon that has been cut
// into its visible line segments, and rejoins the segments by interpolating
// along the clip edge.
function clipRejoin(segments, compareIntersection, startInside, interpolate, stream) {
  var subject = [],
      clip = [],
      i,
      n;

  segments.forEach(function(segment) {
    if ((n = segment.length - 1) <= 0) return;
    var n, p0 = segment[0], p1 = segment[n], x;

    if (pointEqual(p0, p1)) {
      if (!p0[2] && !p1[2]) {
        stream.lineStart();
        for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
        stream.lineEnd();
        return;
      }
      // handle degenerate cases by moving the point
      p1[0] += 2 * epsilon$2;
    }

    subject.push(x = new Intersection(p0, segment, null, true));
    clip.push(x.o = new Intersection(p0, null, x, false));
    subject.push(x = new Intersection(p1, segment, null, false));
    clip.push(x.o = new Intersection(p1, null, x, true));
  });

  if (!subject.length) return;

  clip.sort(compareIntersection);
  link$1(subject);
  link$1(clip);

  for (i = 0, n = clip.length; i < n; ++i) {
    clip[i].e = startInside = !startInside;
  }

  var start = subject[0],
      points,
      point;

  while (1) {
    // Find first unvisited intersection.
    var current = start,
        isSubject = true;
    while (current.v) if ((current = current.n) === start) return;
    points = current.z;
    stream.lineStart();
    do {
      current.v = current.o.v = true;
      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.n.x, 1, stream);
        }
        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;
          for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.p.x, -1, stream);
        }
        current = current.p;
      }
      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);
    stream.lineEnd();
  }
}

function link$1(array) {
  if (!(n = array.length)) return;
  var n,
      i = 0,
      a = array[0],
      b;
  while (++i < n) {
    a.n = b = array[i];
    b.p = a;
    a = b;
  }
  a.n = b = array[0];
  b.p = a;
}

var sum$1 = adder();

function longitude(point) {
  if (abs$1(point[0]) <= pi$2)
    return point[0];
  else
    return sign$1(point[0]) * ((abs$1(point[0]) + pi$2) % tau$2 - pi$2);
}

function polygonContains(polygon, point) {
  var lambda = longitude(point),
      phi = point[1],
      sinPhi = sin$1(phi),
      normal = [sin$1(lambda), -cos$1(lambda), 0],
      angle = 0,
      winding = 0;

  sum$1.reset();

  if (sinPhi === 1) phi = halfPi$1 + epsilon$2;
  else if (sinPhi === -1) phi = -halfPi$1 - epsilon$2;

  for (var i = 0, n = polygon.length; i < n; ++i) {
    if (!(m = (ring = polygon[i]).length)) continue;
    var ring,
        m,
        point0 = ring[m - 1],
        lambda0 = longitude(point0),
        phi0 = point0[1] / 2 + quarterPi,
        sinPhi0 = sin$1(phi0),
        cosPhi0 = cos$1(phi0);

    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
      var point1 = ring[j],
          lambda1 = longitude(point1),
          phi1 = point1[1] / 2 + quarterPi,
          sinPhi1 = sin$1(phi1),
          cosPhi1 = cos$1(phi1),
          delta = lambda1 - lambda0,
          sign = delta >= 0 ? 1 : -1,
          absDelta = sign * delta,
          antimeridian = absDelta > pi$2,
          k = sinPhi0 * sinPhi1;

      sum$1.add(atan2$1(k * sign * sin$1(absDelta), cosPhi0 * cosPhi1 + k * cos$1(absDelta)));
      angle += antimeridian ? delta + sign * tau$2 : delta;

      // Are the longitudes either side of the point’s meridian (lambda),
      // and are the latitudes smaller than the parallel (phi)?
      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
        var arc = cartesianCross(cartesian(point0), cartesian(point1));
        cartesianNormalizeInPlace(arc);
        var intersection = cartesianCross(normal, arc);
        cartesianNormalizeInPlace(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin$1(intersection[2]);
        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }
    }
  }

  // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon winds around it in a clockwise direction.
  // * the polygon does not (cumulatively) wind around it, but has a negative
  //   (counter-clockwise) area.
  //
  // Second, count the (signed) number of times a segment crosses a lambda
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.

  return (angle < -epsilon$2 || angle < epsilon$2 && sum$1 < -epsilon$2) ^ (winding & 1);
}

function clip(pointVisible, clipLine, interpolate, start) {
  return function(sink) {
    var line = clipLine(sink),
        ringBuffer = clipBuffer(),
        ringSink = clipLine(ringBuffer),
        polygonStarted = false,
        polygon,
        segments,
        ring;

    var clip = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        clip.point = pointRing;
        clip.lineStart = ringStart;
        clip.lineEnd = ringEnd;
        segments = [];
        polygon = [];
      },
      polygonEnd: function() {
        clip.point = point;
        clip.lineStart = lineStart;
        clip.lineEnd = lineEnd;
        segments = merge$1(segments);
        var startInside = polygonContains(polygon, start);
        if (segments.length) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          clipRejoin(segments, compareIntersection, startInside, interpolate, sink);
        } else if (startInside) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
        }
        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
        segments = polygon = null;
      },
      sphere: function() {
        sink.polygonStart();
        sink.lineStart();
        interpolate(null, null, 1, sink);
        sink.lineEnd();
        sink.polygonEnd();
      }
    };

    function point(lambda, phi) {
      if (pointVisible(lambda, phi)) sink.point(lambda, phi);
    }

    function pointLine(lambda, phi) {
      line.point(lambda, phi);
    }

    function lineStart() {
      clip.point = pointLine;
      line.lineStart();
    }

    function lineEnd() {
      clip.point = point;
      line.lineEnd();
    }

    function pointRing(lambda, phi) {
      ring.push([lambda, phi]);
      ringSink.point(lambda, phi);
    }

    function ringStart() {
      ringSink.lineStart();
      ring = [];
    }

    function ringEnd() {
      pointRing(ring[0][0], ring[0][1]);
      ringSink.lineEnd();

      var clean = ringSink.clean(),
          ringSegments = ringBuffer.result(),
          i, n = ringSegments.length, m,
          segment,
          point;

      ring.pop();
      polygon.push(ring);
      ring = null;

      if (!n) return;

      // No intersections.
      if (clean & 1) {
        segment = ringSegments[0];
        if ((m = segment.length - 1) > 0) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
          sink.lineEnd();
        }
        return;
      }

      // Rejoin connected segments.
      // TODO reuse ringBuffer.rejoin()?
      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

      segments.push(ringSegments.filter(validSegment));
    }

    return clip;
  };
}

function validSegment(segment) {
  return segment.length > 1;
}

// Intersections are sorted along the clip edge. For both antimeridian cutting
// and circle clipping, the same comparison is used.
function compareIntersection(a, b) {
  return ((a = a.x)[0] < 0 ? a[1] - halfPi$1 - epsilon$2 : halfPi$1 - a[1])
       - ((b = b.x)[0] < 0 ? b[1] - halfPi$1 - epsilon$2 : halfPi$1 - b[1]);
}

var clipAntimeridian = clip(
  function() { return true; },
  clipAntimeridianLine,
  clipAntimeridianInterpolate,
  [-pi$2, -halfPi$1]
);

// Takes a line and cuts into visible segments. Return values: 0 - there were
// intersections or the line was empty; 1 - no intersections; 2 - there were
// intersections, and the first and last segments should be rejoined.
function clipAntimeridianLine(stream) {
  var lambda0 = NaN,
      phi0 = NaN,
      sign0 = NaN,
      clean; // no intersections

  return {
    lineStart: function() {
      stream.lineStart();
      clean = 1;
    },
    point: function(lambda1, phi1) {
      var sign1 = lambda1 > 0 ? pi$2 : -pi$2,
          delta = abs$1(lambda1 - lambda0);
      if (abs$1(delta - pi$2) < epsilon$2) { // line crosses a pole
        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi$1 : -halfPi$1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        stream.point(lambda1, phi0);
        clean = 0;
      } else if (sign0 !== sign1 && delta >= pi$2) { // line crosses antimeridian
        if (abs$1(lambda0 - sign0) < epsilon$2) lambda0 -= sign0 * epsilon$2; // handle degeneracies
        if (abs$1(lambda1 - sign1) < epsilon$2) lambda1 -= sign1 * epsilon$2;
        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        clean = 0;
      }
      stream.point(lambda0 = lambda1, phi0 = phi1);
      sign0 = sign1;
    },
    lineEnd: function() {
      stream.lineEnd();
      lambda0 = phi0 = NaN;
    },
    clean: function() {
      return 2 - clean; // if intersections, rejoin first and last segments
    }
  };
}

function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
  var cosPhi0,
      cosPhi1,
      sinLambda0Lambda1 = sin$1(lambda0 - lambda1);
  return abs$1(sinLambda0Lambda1) > epsilon$2
      ? atan((sin$1(phi0) * (cosPhi1 = cos$1(phi1)) * sin$1(lambda1)
          - sin$1(phi1) * (cosPhi0 = cos$1(phi0)) * sin$1(lambda0))
          / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
      : (phi0 + phi1) / 2;
}

function clipAntimeridianInterpolate(from, to, direction, stream) {
  var phi;
  if (from == null) {
    phi = direction * halfPi$1;
    stream.point(-pi$2, phi);
    stream.point(0, phi);
    stream.point(pi$2, phi);
    stream.point(pi$2, 0);
    stream.point(pi$2, -phi);
    stream.point(0, -phi);
    stream.point(-pi$2, -phi);
    stream.point(-pi$2, 0);
    stream.point(-pi$2, phi);
  } else if (abs$1(from[0] - to[0]) > epsilon$2) {
    var lambda = from[0] < to[0] ? pi$2 : -pi$2;
    phi = direction * lambda / 2;
    stream.point(-lambda, phi);
    stream.point(0, phi);
    stream.point(lambda, phi);
  } else {
    stream.point(to[0], to[1]);
  }
}

function clipCircle(radius) {
  var cr = cos$1(radius),
      delta = 6 * radians,
      smallRadius = cr > 0,
      notHemisphere = abs$1(cr) > epsilon$2; // TODO optimise for this common case

  function interpolate(from, to, direction, stream) {
    circleStream(stream, radius, delta, direction, from, to);
  }

  function visible(lambda, phi) {
    return cos$1(lambda) * cos$1(phi) > cr;
  }

  // Takes a line and cuts into visible segments. Return values used for polygon
  // clipping: 0 - there were intersections or the line was empty; 1 - no
  // intersections 2 - there were intersections, and the first and last segments
  // should be rejoined.
  function clipLine(stream) {
    var point0, // previous point
        c0, // code for previous point
        v0, // visibility of previous point
        v00, // visibility of first point
        clean; // no intersections
    return {
      lineStart: function() {
        v00 = v0 = false;
        clean = 1;
      },
      point: function(lambda, phi) {
        var point1 = [lambda, phi],
            point2,
            v = visible(lambda, phi),
            c = smallRadius
              ? v ? 0 : code(lambda, phi)
              : v ? code(lambda + (lambda < 0 ? pi$2 : -pi$2), phi) : 0;
        if (!point0 && (v00 = v0 = v)) stream.lineStart();
        if (v !== v0) {
          point2 = intersect(point0, point1);
          if (!point2 || pointEqual(point0, point2) || pointEqual(point1, point2))
            point1[2] = 1;
        }
        if (v !== v0) {
          clean = 0;
          if (v) {
            // outside going in
            stream.lineStart();
            point2 = intersect(point1, point0);
            stream.point(point2[0], point2[1]);
          } else {
            // inside going out
            point2 = intersect(point0, point1);
            stream.point(point2[0], point2[1], 2);
            stream.lineEnd();
          }
          point0 = point2;
        } else if (notHemisphere && point0 && smallRadius ^ v) {
          var t;
          // If the codes for two points are different, or are both zero,
          // and there this segment intersects with the small circle.
          if (!(c & c0) && (t = intersect(point1, point0, true))) {
            clean = 0;
            if (smallRadius) {
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
            } else {
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
              stream.lineStart();
              stream.point(t[0][0], t[0][1], 3);
            }
          }
        }
        if (v && (!point0 || !pointEqual(point0, point1))) {
          stream.point(point1[0], point1[1]);
        }
        point0 = point1, v0 = v, c0 = c;
      },
      lineEnd: function() {
        if (v0) stream.lineEnd();
        point0 = null;
      },
      // Rejoin first and last segments if there were intersections and the first
      // and last points were visible.
      clean: function() {
        return clean | ((v00 && v0) << 1);
      }
    };
  }

  // Intersects the great circle between a and b with the clip circle.
  function intersect(a, b, two) {
    var pa = cartesian(a),
        pb = cartesian(b);

    // We have two planes, n1.p = d1 and n2.p = d2.
    // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
    var n1 = [1, 0, 0], // normal
        n2 = cartesianCross(pa, pb),
        n2n2 = cartesianDot(n2, n2),
        n1n2 = n2[0], // cartesianDot(n1, n2),
        determinant = n2n2 - n1n2 * n1n2;

    // Two polar points.
    if (!determinant) return !two && a;

    var c1 =  cr * n2n2 / determinant,
        c2 = -cr * n1n2 / determinant,
        n1xn2 = cartesianCross(n1, n2),
        A = cartesianScale(n1, c1),
        B = cartesianScale(n2, c2);
    cartesianAddInPlace(A, B);

    // Solve |p(t)|^2 = 1.
    var u = n1xn2,
        w = cartesianDot(A, u),
        uu = cartesianDot(u, u),
        t2 = w * w - uu * (cartesianDot(A, A) - 1);

    if (t2 < 0) return;

    var t = sqrt$1(t2),
        q = cartesianScale(u, (-w - t) / uu);
    cartesianAddInPlace(q, A);
    q = spherical(q);

    if (!two) return q;

    // Two intersection points.
    var lambda0 = a[0],
        lambda1 = b[0],
        phi0 = a[1],
        phi1 = b[1],
        z;

    if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

    var delta = lambda1 - lambda0,
        polar = abs$1(delta - pi$2) < epsilon$2,
        meridian = polar || delta < epsilon$2;

    if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

    // Check that the first point is between a and b.
    if (meridian
        ? polar
          ? phi0 + phi1 > 0 ^ q[1] < (abs$1(q[0] - lambda0) < epsilon$2 ? phi0 : phi1)
          : phi0 <= q[1] && q[1] <= phi1
        : delta > pi$2 ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
      var q1 = cartesianScale(u, (-w + t) / uu);
      cartesianAddInPlace(q1, A);
      return [q, spherical(q1)];
    }
  }

  // Generates a 4-bit vector representing the location of a point relative to
  // the small circle's bounding box.
  function code(lambda, phi) {
    var r = smallRadius ? radius : pi$2 - radius,
        code = 0;
    if (lambda < -r) code |= 1; // left
    else if (lambda > r) code |= 2; // right
    if (phi < -r) code |= 4; // below
    else if (phi > r) code |= 8; // above
    return code;
  }

  return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi$2, radius - pi$2]);
}

function clipLine(a, b, x0, y0, x1, y1) {
  var ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;

  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;
  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;
  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;
  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;
  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
  if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
  return true;
}

var clipMax = 1e9, clipMin = -clipMax;

// TODO Use d3-polygon’s polygonContains here for the ring check?
// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

function clipRectangle(x0, y0, x1, y1) {

  function visible(x, y) {
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }

  function interpolate(from, to, direction, stream) {
    var a = 0, a1 = 0;
    if (from == null
        || (a = corner(from, direction)) !== (a1 = corner(to, direction))
        || comparePoint(from, to) < 0 ^ direction > 0) {
      do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
      while ((a = (a + direction + 4) % 4) !== a1);
    } else {
      stream.point(to[0], to[1]);
    }
  }

  function corner(p, direction) {
    return abs$1(p[0] - x0) < epsilon$2 ? direction > 0 ? 0 : 3
        : abs$1(p[0] - x1) < epsilon$2 ? direction > 0 ? 2 : 1
        : abs$1(p[1] - y0) < epsilon$2 ? direction > 0 ? 1 : 0
        : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
  }

  function compareIntersection(a, b) {
    return comparePoint(a.x, b.x);
  }

  function comparePoint(a, b) {
    var ca = corner(a, 1),
        cb = corner(b, 1);
    return ca !== cb ? ca - cb
        : ca === 0 ? b[1] - a[1]
        : ca === 1 ? a[0] - b[0]
        : ca === 2 ? a[1] - b[1]
        : b[0] - a[0];
  }

  return function(stream) {
    var activeStream = stream,
        bufferStream = clipBuffer(),
        segments,
        polygon,
        ring,
        x__, y__, v__, // first point
        x_, y_, v_, // previous point
        first,
        clean;

    var clipStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: polygonStart,
      polygonEnd: polygonEnd
    };

    function point(x, y) {
      if (visible(x, y)) activeStream.point(x, y);
    }

    function polygonInside() {
      var winding = 0;

      for (var i = 0, n = polygon.length; i < n; ++i) {
        for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
          a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
          if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
          else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
        }
      }

      return winding;
    }

    // Buffer geometry within a polygon and then clip it en masse.
    function polygonStart() {
      activeStream = bufferStream, segments = [], polygon = [], clean = true;
    }

    function polygonEnd() {
      var startInside = polygonInside(),
          cleanInside = clean && startInside,
          visible = (segments = merge$1(segments)).length;
      if (cleanInside || visible) {
        stream.polygonStart();
        if (cleanInside) {
          stream.lineStart();
          interpolate(null, null, 1, stream);
          stream.lineEnd();
        }
        if (visible) {
          clipRejoin(segments, compareIntersection, startInside, interpolate, stream);
        }
        stream.polygonEnd();
      }
      activeStream = stream, segments = polygon = ring = null;
    }

    function lineStart() {
      clipStream.point = linePoint;
      if (polygon) polygon.push(ring = []);
      first = true;
      v_ = false;
      x_ = y_ = NaN;
    }

    // TODO rather than special-case polygons, simply handle them separately.
    // Ideally, coincident intersection points should be jittered to avoid
    // clipping issues.
    function lineEnd() {
      if (segments) {
        linePoint(x__, y__);
        if (v__ && v_) bufferStream.rejoin();
        segments.push(bufferStream.result());
      }
      clipStream.point = point;
      if (v_) activeStream.lineEnd();
    }

    function linePoint(x, y) {
      var v = visible(x, y);
      if (polygon) ring.push([x, y]);
      if (first) {
        x__ = x, y__ = y, v__ = v;
        first = false;
        if (v) {
          activeStream.lineStart();
          activeStream.point(x, y);
        }
      } else {
        if (v && v_) activeStream.point(x, y);
        else {
          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
              b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
          if (clipLine(a, b, x0, y0, x1, y1)) {
            if (!v_) {
              activeStream.lineStart();
              activeStream.point(a[0], a[1]);
            }
            activeStream.point(b[0], b[1]);
            if (!v) activeStream.lineEnd();
            clean = false;
          } else if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
            clean = false;
          }
        }
      }
      x_ = x, y_ = y, v_ = v;
    }

    return clipStream;
  };
}

function extent() {
  var x0 = 0,
      y0 = 0,
      x1 = 960,
      y1 = 500,
      cache,
      cacheStream,
      clip;

  return clip = {
    stream: function(stream) {
      return cache && cacheStream === stream ? cache : cache = clipRectangle(x0, y0, x1, y1)(cacheStream = stream);
    },
    extent: function(_) {
      return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
    }
  };
}

var lengthSum$1 = adder(),
    lambda0,
    sinPhi0,
    cosPhi0;

var lengthStream$1 = {
  sphere: noop$1,
  point: noop$1,
  lineStart: lengthLineStart,
  lineEnd: noop$1,
  polygonStart: noop$1,
  polygonEnd: noop$1
};

function lengthLineStart() {
  lengthStream$1.point = lengthPointFirst$1;
  lengthStream$1.lineEnd = lengthLineEnd;
}

function lengthLineEnd() {
  lengthStream$1.point = lengthStream$1.lineEnd = noop$1;
}

function lengthPointFirst$1(lambda, phi) {
  lambda *= radians, phi *= radians;
  lambda0 = lambda, sinPhi0 = sin$1(phi), cosPhi0 = cos$1(phi);
  lengthStream$1.point = lengthPoint$1;
}

function lengthPoint$1(lambda, phi) {
  lambda *= radians, phi *= radians;
  var sinPhi = sin$1(phi),
      cosPhi = cos$1(phi),
      delta = abs$1(lambda - lambda0),
      cosDelta = cos$1(delta),
      sinDelta = sin$1(delta),
      x = cosPhi * sinDelta,
      y = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDelta,
      z = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDelta;
  lengthSum$1.add(atan2$1(sqrt$1(x * x + y * y), z));
  lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
}

function length(object) {
  lengthSum$1.reset();
  geoStream(object, lengthStream$1);
  return +lengthSum$1;
}

var coordinates = [null, null],
    object = {type: "LineString", coordinates: coordinates};

function distance(a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return length(object);
}

var containsObjectType = {
  Feature: function(object, point) {
    return containsGeometry(object.geometry, point);
  },
  FeatureCollection: function(object, point) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) if (containsGeometry(features[i].geometry, point)) return true;
    return false;
  }
};

var containsGeometryType = {
  Sphere: function() {
    return true;
  },
  Point: function(object, point) {
    return containsPoint(object.coordinates, point);
  },
  MultiPoint: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPoint(coordinates[i], point)) return true;
    return false;
  },
  LineString: function(object, point) {
    return containsLine(object.coordinates, point);
  },
  MultiLineString: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsLine(coordinates[i], point)) return true;
    return false;
  },
  Polygon: function(object, point) {
    return containsPolygon(object.coordinates, point);
  },
  MultiPolygon: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPolygon(coordinates[i], point)) return true;
    return false;
  },
  GeometryCollection: function(object, point) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) if (containsGeometry(geometries[i], point)) return true;
    return false;
  }
};

function containsGeometry(geometry, point) {
  return geometry && containsGeometryType.hasOwnProperty(geometry.type)
      ? containsGeometryType[geometry.type](geometry, point)
      : false;
}

function containsPoint(coordinates, point) {
  return distance(coordinates, point) === 0;
}

function containsLine(coordinates, point) {
  var ao, bo, ab;
  for (var i = 0, n = coordinates.length; i < n; i++) {
    bo = distance(coordinates[i], point);
    if (bo === 0) return true;
    if (i > 0) {
      ab = distance(coordinates[i], coordinates[i - 1]);
      if (
        ab > 0 &&
        ao <= ab &&
        bo <= ab &&
        (ao + bo - ab) * (1 - Math.pow((ao - bo) / ab, 2)) < epsilon2 * ab
      )
        return true;
    }
    ao = bo;
  }
  return false;
}

function containsPolygon(coordinates, point) {
  return !!polygonContains(coordinates.map(ringRadians), pointRadians(point));
}

function ringRadians(ring) {
  return ring = ring.map(pointRadians), ring.pop(), ring;
}

function pointRadians(point) {
  return [point[0] * radians, point[1] * radians];
}

function contains(object, point) {
  return (object && containsObjectType.hasOwnProperty(object.type)
      ? containsObjectType[object.type]
      : containsGeometry)(object, point);
}

function graticuleX(y0, y1, dy) {
  var y = range$1(y0, y1 - epsilon$2, dy).concat(y1);
  return function(x) { return y.map(function(y) { return [x, y]; }); };
}

function graticuleY(x0, x1, dx) {
  var x = range$1(x0, x1 - epsilon$2, dx).concat(x1);
  return function(y) { return x.map(function(x) { return [x, y]; }); };
}

function graticule() {
  var x1, x0, X1, X0,
      y1, y0, Y1, Y0,
      dx = 10, dy = dx, DX = 90, DY = 360,
      x, y, X, Y,
      precision = 2.5;

  function graticule() {
    return {type: "MultiLineString", coordinates: lines()};
  }

  function lines() {
    return range$1(ceil(X0 / DX) * DX, X1, DX).map(X)
        .concat(range$1(ceil(Y0 / DY) * DY, Y1, DY).map(Y))
        .concat(range$1(ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return abs$1(x % DX) > epsilon$2; }).map(x))
        .concat(range$1(ceil(y0 / dy) * dy, y1, dy).filter(function(y) { return abs$1(y % DY) > epsilon$2; }).map(y));
  }

  graticule.lines = function() {
    return lines().map(function(coordinates) { return {type: "LineString", coordinates: coordinates}; });
  };

  graticule.outline = function() {
    return {
      type: "Polygon",
      coordinates: [
        X(X0).concat(
        Y(Y1).slice(1),
        X(X1).reverse().slice(1),
        Y(Y0).reverse().slice(1))
      ]
    };
  };

  graticule.extent = function(_) {
    if (!arguments.length) return graticule.extentMinor();
    return graticule.extentMajor(_).extentMinor(_);
  };

  graticule.extentMajor = function(_) {
    if (!arguments.length) return [[X0, Y0], [X1, Y1]];
    X0 = +_[0][0], X1 = +_[1][0];
    Y0 = +_[0][1], Y1 = +_[1][1];
    if (X0 > X1) _ = X0, X0 = X1, X1 = _;
    if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
    return graticule.precision(precision);
  };

  graticule.extentMinor = function(_) {
    if (!arguments.length) return [[x0, y0], [x1, y1]];
    x0 = +_[0][0], x1 = +_[1][0];
    y0 = +_[0][1], y1 = +_[1][1];
    if (x0 > x1) _ = x0, x0 = x1, x1 = _;
    if (y0 > y1) _ = y0, y0 = y1, y1 = _;
    return graticule.precision(precision);
  };

  graticule.step = function(_) {
    if (!arguments.length) return graticule.stepMinor();
    return graticule.stepMajor(_).stepMinor(_);
  };

  graticule.stepMajor = function(_) {
    if (!arguments.length) return [DX, DY];
    DX = +_[0], DY = +_[1];
    return graticule;
  };

  graticule.stepMinor = function(_) {
    if (!arguments.length) return [dx, dy];
    dx = +_[0], dy = +_[1];
    return graticule;
  };

  graticule.precision = function(_) {
    if (!arguments.length) return precision;
    precision = +_;
    x = graticuleX(y0, y1, 90);
    y = graticuleY(x0, x1, precision);
    X = graticuleX(Y0, Y1, 90);
    Y = graticuleY(X0, X1, precision);
    return graticule;
  };

  return graticule
      .extentMajor([[-180, -90 + epsilon$2], [180, 90 - epsilon$2]])
      .extentMinor([[-180, -80 - epsilon$2], [180, 80 + epsilon$2]]);
}

function graticule10() {
  return graticule()();
}

function interpolate(a, b) {
  var x0 = a[0] * radians,
      y0 = a[1] * radians,
      x1 = b[0] * radians,
      y1 = b[1] * radians,
      cy0 = cos$1(y0),
      sy0 = sin$1(y0),
      cy1 = cos$1(y1),
      sy1 = sin$1(y1),
      kx0 = cy0 * cos$1(x0),
      ky0 = cy0 * sin$1(x0),
      kx1 = cy1 * cos$1(x1),
      ky1 = cy1 * sin$1(x1),
      d = 2 * asin$1(sqrt$1(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
      k = sin$1(d);

  var interpolate = d ? function(t) {
    var B = sin$1(t *= d) / k,
        A = sin$1(d - t) / k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      atan2$1(y, x) * degrees,
      atan2$1(z, sqrt$1(x * x + y * y)) * degrees
    ];
  } : function() {
    return [x0 * degrees, y0 * degrees];
  };

  interpolate.distance = d;

  return interpolate;
}

function identity$2(x) {
  return x;
}

var areaSum = adder(),
    areaRingSum = adder(),
    x00$2,
    y00$2,
    x0$3,
    y0$3;

var areaStream = {
  point: noop$1,
  lineStart: noop$1,
  lineEnd: noop$1,
  polygonStart: function() {
    areaStream.lineStart = areaRingStart;
    areaStream.lineEnd = areaRingEnd;
  },
  polygonEnd: function() {
    areaStream.lineStart = areaStream.lineEnd = areaStream.point = noop$1;
    areaSum.add(abs$1(areaRingSum));
    areaRingSum.reset();
  },
  result: function() {
    var area = areaSum / 2;
    areaSum.reset();
    return area;
  }
};

function areaRingStart() {
  areaStream.point = areaPointFirst;
}

function areaPointFirst(x, y) {
  areaStream.point = areaPoint;
  x00$2 = x0$3 = x, y00$2 = y0$3 = y;
}

function areaPoint(x, y) {
  areaRingSum.add(y0$3 * x - x0$3 * y);
  x0$3 = x, y0$3 = y;
}

function areaRingEnd() {
  areaPoint(x00$2, y00$2);
}

var x0$2 = Infinity,
    y0$2 = x0$2,
    x1 = -x0$2,
    y1 = x1;

var boundsStream = {
  point: boundsPoint,
  lineStart: noop$1,
  lineEnd: noop$1,
  polygonStart: noop$1,
  polygonEnd: noop$1,
  result: function() {
    var bounds = [[x0$2, y0$2], [x1, y1]];
    x1 = y1 = -(y0$2 = x0$2 = Infinity);
    return bounds;
  }
};

function boundsPoint(x, y) {
  if (x < x0$2) x0$2 = x;
  if (x > x1) x1 = x;
  if (y < y0$2) y0$2 = y;
  if (y > y1) y1 = y;
}

// TODO Enforce positive area for exterior, negative area for interior?

var X0 = 0,
    Y0 = 0,
    Z0 = 0,
    X1 = 0,
    Y1 = 0,
    Z1 = 0,
    X2 = 0,
    Y2 = 0,
    Z2 = 0,
    x00$1,
    y00$1,
    x0$1,
    y0$1;

var centroidStream = {
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function() {
    centroidStream.lineStart = centroidRingStart;
    centroidStream.lineEnd = centroidRingEnd;
  },
  polygonEnd: function() {
    centroidStream.point = centroidPoint;
    centroidStream.lineStart = centroidLineStart;
    centroidStream.lineEnd = centroidLineEnd;
  },
  result: function() {
    var centroid = Z2 ? [X2 / Z2, Y2 / Z2]
        : Z1 ? [X1 / Z1, Y1 / Z1]
        : Z0 ? [X0 / Z0, Y0 / Z0]
        : [NaN, NaN];
    X0 = Y0 = Z0 =
    X1 = Y1 = Z1 =
    X2 = Y2 = Z2 = 0;
    return centroid;
  }
};

function centroidPoint(x, y) {
  X0 += x;
  Y0 += y;
  ++Z0;
}

function centroidLineStart() {
  centroidStream.point = centroidPointFirstLine;
}

function centroidPointFirstLine(x, y) {
  centroidStream.point = centroidPointLine;
  centroidPoint(x0$1 = x, y0$1 = y);
}

function centroidPointLine(x, y) {
  var dx = x - x0$1, dy = y - y0$1, z = sqrt$1(dx * dx + dy * dy);
  X1 += z * (x0$1 + x) / 2;
  Y1 += z * (y0$1 + y) / 2;
  Z1 += z;
  centroidPoint(x0$1 = x, y0$1 = y);
}

function centroidLineEnd() {
  centroidStream.point = centroidPoint;
}

function centroidRingStart() {
  centroidStream.point = centroidPointFirstRing;
}

function centroidRingEnd() {
  centroidPointRing(x00$1, y00$1);
}

function centroidPointFirstRing(x, y) {
  centroidStream.point = centroidPointRing;
  centroidPoint(x00$1 = x0$1 = x, y00$1 = y0$1 = y);
}

function centroidPointRing(x, y) {
  var dx = x - x0$1,
      dy = y - y0$1,
      z = sqrt$1(dx * dx + dy * dy);

  X1 += z * (x0$1 + x) / 2;
  Y1 += z * (y0$1 + y) / 2;
  Z1 += z;

  z = y0$1 * x - x0$1 * y;
  X2 += z * (x0$1 + x);
  Y2 += z * (y0$1 + y);
  Z2 += z * 3;
  centroidPoint(x0$1 = x, y0$1 = y);
}

function PathContext(context) {
  this._context = context;
}

PathContext.prototype = {
  _radius: 4.5,
  pointRadius: function(_) {
    return this._radius = _, this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._context.closePath();
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._context.moveTo(x, y);
        this._point = 1;
        break;
      }
      case 1: {
        this._context.lineTo(x, y);
        break;
      }
      default: {
        this._context.moveTo(x + this._radius, y);
        this._context.arc(x, y, this._radius, 0, tau$2);
        break;
      }
    }
  },
  result: noop$1
};

var lengthSum = adder(),
    lengthRing,
    x00,
    y00,
    x0,
    y0;

var lengthStream = {
  point: noop$1,
  lineStart: function() {
    lengthStream.point = lengthPointFirst;
  },
  lineEnd: function() {
    if (lengthRing) lengthPoint(x00, y00);
    lengthStream.point = noop$1;
  },
  polygonStart: function() {
    lengthRing = true;
  },
  polygonEnd: function() {
    lengthRing = null;
  },
  result: function() {
    var length = +lengthSum;
    lengthSum.reset();
    return length;
  }
};

function lengthPointFirst(x, y) {
  lengthStream.point = lengthPoint;
  x00 = x0 = x, y00 = y0 = y;
}

function lengthPoint(x, y) {
  x0 -= x, y0 -= y;
  lengthSum.add(sqrt$1(x0 * x0 + y0 * y0));
  x0 = x, y0 = y;
}

function PathString() {
  this._string = [];
}

PathString.prototype = {
  _radius: 4.5,
  _circle: circle$1(4.5),
  pointRadius: function(_) {
    if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
    return this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._string.push("Z");
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._string.push("M", x, ",", y);
        this._point = 1;
        break;
      }
      case 1: {
        this._string.push("L", x, ",", y);
        break;
      }
      default: {
        if (this._circle == null) this._circle = circle$1(this._radius);
        this._string.push("M", x, ",", y, this._circle);
        break;
      }
    }
  },
  result: function() {
    if (this._string.length) {
      var result = this._string.join("");
      this._string = [];
      return result;
    } else {
      return null;
    }
  }
};

function circle$1(radius) {
  return "m0," + radius
      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
      + "z";
}

function index(projection, context) {
  var pointRadius = 4.5,
      projectionStream,
      contextStream;

  function path(object) {
    if (object) {
      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
      geoStream(object, projectionStream(contextStream));
    }
    return contextStream.result();
  }

  path.area = function(object) {
    geoStream(object, projectionStream(areaStream));
    return areaStream.result();
  };

  path.measure = function(object) {
    geoStream(object, projectionStream(lengthStream));
    return lengthStream.result();
  };

  path.bounds = function(object) {
    geoStream(object, projectionStream(boundsStream));
    return boundsStream.result();
  };

  path.centroid = function(object) {
    geoStream(object, projectionStream(centroidStream));
    return centroidStream.result();
  };

  path.projection = function(_) {
    return arguments.length ? (projectionStream = _ == null ? (projection = null, identity$2) : (projection = _).stream, path) : projection;
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
    return path;
  };

  path.pointRadius = function(_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path;
  };

  return path.projection(projection).context(context);
}

function transform(methods) {
  return {
    stream: transformer(methods)
  };
}

function transformer(methods) {
  return function(stream) {
    var s = new TransformStream;
    for (var key in methods) s[key] = methods[key];
    s.stream = stream;
    return s;
  };
}

function TransformStream() {}

TransformStream.prototype = {
  constructor: TransformStream,
  point: function(x, y) { this.stream.point(x, y); },
  sphere: function() { this.stream.sphere(); },
  lineStart: function() { this.stream.lineStart(); },
  lineEnd: function() { this.stream.lineEnd(); },
  polygonStart: function() { this.stream.polygonStart(); },
  polygonEnd: function() { this.stream.polygonEnd(); }
};

function fit(projection, fitBounds, object) {
  var clip = projection.clipExtent && projection.clipExtent();
  projection.scale(150).translate([0, 0]);
  if (clip != null) projection.clipExtent(null);
  geoStream(object, projection.stream(boundsStream));
  fitBounds(boundsStream.result());
  if (clip != null) projection.clipExtent(clip);
  return projection;
}

function fitExtent(projection, extent, object) {
  return fit(projection, function(b) {
    var w = extent[1][0] - extent[0][0],
        h = extent[1][1] - extent[0][1],
        k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
        x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
        y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
    projection.scale(150 * k).translate([x, y]);
  }, object);
}

function fitSize(projection, size, object) {
  return fitExtent(projection, [[0, 0], size], object);
}

function fitWidth(projection, width, object) {
  return fit(projection, function(b) {
    var w = +width,
        k = w / (b[1][0] - b[0][0]),
        x = (w - k * (b[1][0] + b[0][0])) / 2,
        y = -k * b[0][1];
    projection.scale(150 * k).translate([x, y]);
  }, object);
}

function fitHeight(projection, height, object) {
  return fit(projection, function(b) {
    var h = +height,
        k = h / (b[1][1] - b[0][1]),
        x = -k * b[0][0],
        y = (h - k * (b[1][1] + b[0][1])) / 2;
    projection.scale(150 * k).translate([x, y]);
  }, object);
}

var maxDepth = 16, // maximum depth of subdivision
    cosMinDistance = cos$1(30 * radians); // cos(minimum angular distance)

function resample(project, delta2) {
  return +delta2 ? resample$1(project, delta2) : resampleNone(project);
}

function resampleNone(project) {
  return transformer({
    point: function(x, y) {
      x = project(x, y);
      this.stream.point(x[0], x[1]);
    }
  });
}

function resample$1(project, delta2) {

  function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
    var dx = x1 - x0,
        dy = y1 - y0,
        d2 = dx * dx + dy * dy;
    if (d2 > 4 * delta2 && depth--) {
      var a = a0 + a1,
          b = b0 + b1,
          c = c0 + c1,
          m = sqrt$1(a * a + b * b + c * c),
          phi2 = asin$1(c /= m),
          lambda2 = abs$1(abs$1(c) - 1) < epsilon$2 || abs$1(lambda0 - lambda1) < epsilon$2 ? (lambda0 + lambda1) / 2 : atan2$1(b, a),
          p = project(lambda2, phi2),
          x2 = p[0],
          y2 = p[1],
          dx2 = x2 - x0,
          dy2 = y2 - y0,
          dz = dy * dx2 - dx * dy2;
      if (dz * dz / d2 > delta2 // perpendicular projected distance
          || abs$1((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
          || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
        stream.point(x2, y2);
        resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
      }
    }
  }
  return function(stream) {
    var lambda00, x00, y00, a00, b00, c00, // first point
        lambda0, x0, y0, a0, b0, c0; // previous point

    var resampleStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
      polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
    };

    function point(x, y) {
      x = project(x, y);
      stream.point(x[0], x[1]);
    }

    function lineStart() {
      x0 = NaN;
      resampleStream.point = linePoint;
      stream.lineStart();
    }

    function linePoint(lambda, phi) {
      var c = cartesian([lambda, phi]), p = project(lambda, phi);
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
      stream.point(x0, y0);
    }

    function lineEnd() {
      resampleStream.point = point;
      stream.lineEnd();
    }

    function ringStart() {
      lineStart();
      resampleStream.point = ringPoint;
      resampleStream.lineEnd = ringEnd;
    }

    function ringPoint(lambda, phi) {
      linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
      resampleStream.point = linePoint;
    }

    function ringEnd() {
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
      resampleStream.lineEnd = lineEnd;
      lineEnd();
    }

    return resampleStream;
  };
}

var transformRadians = transformer({
  point: function(x, y) {
    this.stream.point(x * radians, y * radians);
  }
});

function transformRotate(rotate) {
  return transformer({
    point: function(x, y) {
      var r = rotate(x, y);
      return this.stream.point(r[0], r[1]);
    }
  });
}

function scaleTranslate(k, dx, dy, sx, sy) {
  function transform(x, y) {
    x *= sx; y *= sy;
    return [dx + k * x, dy - k * y];
  }
  transform.invert = function(x, y) {
    return [(x - dx) / k * sx, (dy - y) / k * sy];
  };
  return transform;
}

function scaleTranslateRotate(k, dx, dy, sx, sy, alpha) {
  var cosAlpha = cos$1(alpha),
      sinAlpha = sin$1(alpha),
      a = cosAlpha * k,
      b = sinAlpha * k,
      ai = cosAlpha / k,
      bi = sinAlpha / k,
      ci = (sinAlpha * dy - cosAlpha * dx) / k,
      fi = (sinAlpha * dx + cosAlpha * dy) / k;
  function transform(x, y) {
    x *= sx; y *= sy;
    return [a * x - b * y + dx, dy - b * x - a * y];
  }
  transform.invert = function(x, y) {
    return [sx * (ai * x - bi * y + ci), sy * (fi - bi * x - ai * y)];
  };
  return transform;
}

function projection(project) {
  return projectionMutator(function() { return project; })();
}

function projectionMutator(projectAt) {
  var project,
      k = 150, // scale
      x = 480, y = 250, // translate
      lambda = 0, phi = 0, // center
      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, // pre-rotate
      alpha = 0, // post-rotate angle
      sx = 1, // reflectX
      sy = 1, // reflectX
      theta = null, preclip = clipAntimeridian, // pre-clip angle
      x0 = null, y0, x1, y1, postclip = identity$2, // post-clip extent
      delta2 = 0.5, // precision
      projectResample,
      projectTransform,
      projectRotateTransform,
      cache,
      cacheStream;

  function projection(point) {
    return projectRotateTransform(point[0] * radians, point[1] * radians);
  }

  function invert(point) {
    point = projectRotateTransform.invert(point[0], point[1]);
    return point && [point[0] * degrees, point[1] * degrees];
  }

  projection.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream)))));
  };

  projection.preclip = function(_) {
    return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
  };

  projection.postclip = function(_) {
    return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
  };

  projection.clipAngle = function(_) {
    return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
  };

  projection.clipExtent = function(_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity$2) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  projection.scale = function(_) {
    return arguments.length ? (k = +_, recenter()) : k;
  };

  projection.translate = function(_) {
    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
  };

  projection.center = function(_) {
    return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
  };

  projection.rotate = function(_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
  };

  projection.angle = function(_) {
    return arguments.length ? (alpha = _ % 360 * radians, recenter()) : alpha * degrees;
  };

  projection.reflectX = function(_) {
    return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
  };

  projection.reflectY = function(_) {
    return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
  };

  projection.precision = function(_) {
    return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt$1(delta2);
  };

  projection.fitExtent = function(extent, object) {
    return fitExtent(projection, extent, object);
  };

  projection.fitSize = function(size, object) {
    return fitSize(projection, size, object);
  };

  projection.fitWidth = function(width, object) {
    return fitWidth(projection, width, object);
  };

  projection.fitHeight = function(height, object) {
    return fitHeight(projection, height, object);
  };

  function recenter() {
    var center = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)),
        transform = (alpha ? scaleTranslateRotate : scaleTranslate)(k, x - center[0], y - center[1], sx, sy, alpha);
    rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma);
    projectTransform = compose(project, transform);
    projectRotateTransform = compose(rotate, projectTransform);
    projectResample = resample(projectTransform, delta2);
    return reset();
  }

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return recenter();
  };
}

function conicProjection(projectAt) {
  var phi0 = 0,
      phi1 = pi$2 / 3,
      m = projectionMutator(projectAt),
      p = m(phi0, phi1);

  p.parallels = function(_) {
    return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees, phi1 * degrees];
  };

  return p;
}

function cylindricalEqualAreaRaw(phi0) {
  var cosPhi0 = cos$1(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, sin$1(phi) / cosPhi0];
  }

  forward.invert = function(x, y) {
    return [x / cosPhi0, asin$1(y * cosPhi0)];
  };

  return forward;
}

function conicEqualAreaRaw(y0, y1) {
  var sy0 = sin$1(y0), n = (sy0 + sin$1(y1)) / 2;

  // Are the parallels symmetrical around the Equator?
  if (abs$1(n) < epsilon$2) return cylindricalEqualAreaRaw(y0);

  var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt$1(c) / n;

  function project(x, y) {
    var r = sqrt$1(c - 2 * n * sin$1(y)) / n;
    return [r * sin$1(x *= n), r0 - r * cos$1(x)];
  }

  project.invert = function(x, y) {
    var r0y = r0 - y,
        l = atan2$1(x, abs$1(r0y)) * sign$1(r0y);
    if (r0y * n < 0)
      l -= pi$2 * sign$1(x) * sign$1(r0y);
    return [l / n, asin$1((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
  };

  return project;
}

function conicEqualArea() {
  return conicProjection(conicEqualAreaRaw)
      .scale(155.424)
      .center([0, 33.6442]);
}

function albers() {
  return conicEqualArea()
      .parallels([29.5, 45.5])
      .scale(1070)
      .translate([480, 250])
      .rotate([96, 0])
      .center([-0.6, 38.7]);
}

// The projections must have mutually exclusive clip regions on the sphere,
// as this will avoid emitting interleaving lines and polygons.
function multiplex(streams) {
  var n = streams.length;
  return {
    point: function(x, y) { var i = -1; while (++i < n) streams[i].point(x, y); },
    sphere: function() { var i = -1; while (++i < n) streams[i].sphere(); },
    lineStart: function() { var i = -1; while (++i < n) streams[i].lineStart(); },
    lineEnd: function() { var i = -1; while (++i < n) streams[i].lineEnd(); },
    polygonStart: function() { var i = -1; while (++i < n) streams[i].polygonStart(); },
    polygonEnd: function() { var i = -1; while (++i < n) streams[i].polygonEnd(); }
  };
}

// A composite projection for the United States, configured by default for
// 960×500. The projection also works quite well at 960×600 if you change the
// scale to 1285 and adjust the translate accordingly. The set of standard
// parallels for each region comes from USGS, which is published here:
// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
function albersUsa() {
  var cache,
      cacheStream,
      lower48 = albers(), lower48Point,
      alaska = conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, // EPSG:3338
      hawaii = conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, // ESRI:102007
      point, pointStream = {point: function(x, y) { point = [x, y]; }};

  function albersUsa(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (lower48Point.point(x, y), point)
        || (alaskaPoint.point(x, y), point)
        || (hawaiiPoint.point(x, y), point);
  }

  albersUsa.invert = function(coordinates) {
    var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
        : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
        : lower48).invert(coordinates);
  };

  albersUsa.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
  };

  albersUsa.precision = function(_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
    return reset();
  };

  albersUsa.scale = function(_) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
    return albersUsa.translate(lower48.translate());
  };

  albersUsa.translate = function(_) {
    if (!arguments.length) return lower48.translate();
    var k = lower48.scale(), x = +_[0], y = +_[1];

    lower48Point = lower48
        .translate(_)
        .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
        .stream(pointStream);

    alaskaPoint = alaska
        .translate([x - 0.307 * k, y + 0.201 * k])
        .clipExtent([[x - 0.425 * k + epsilon$2, y + 0.120 * k + epsilon$2], [x - 0.214 * k - epsilon$2, y + 0.234 * k - epsilon$2]])
        .stream(pointStream);

    hawaiiPoint = hawaii
        .translate([x - 0.205 * k, y + 0.212 * k])
        .clipExtent([[x - 0.214 * k + epsilon$2, y + 0.166 * k + epsilon$2], [x - 0.115 * k - epsilon$2, y + 0.234 * k - epsilon$2]])
        .stream(pointStream);

    return reset();
  };

  albersUsa.fitExtent = function(extent, object) {
    return fitExtent(albersUsa, extent, object);
  };

  albersUsa.fitSize = function(size, object) {
    return fitSize(albersUsa, size, object);
  };

  albersUsa.fitWidth = function(width, object) {
    return fitWidth(albersUsa, width, object);
  };

  albersUsa.fitHeight = function(height, object) {
    return fitHeight(albersUsa, height, object);
  };

  function reset() {
    cache = cacheStream = null;
    return albersUsa;
  }

  return albersUsa.scale(1070);
}

function azimuthalRaw(scale) {
  return function(x, y) {
    var cx = cos$1(x),
        cy = cos$1(y),
        k = scale(cx * cy);
    return [
      k * cy * sin$1(x),
      k * sin$1(y)
    ];
  }
}

function azimuthalInvert(angle) {
  return function(x, y) {
    var z = sqrt$1(x * x + y * y),
        c = angle(z),
        sc = sin$1(c),
        cc = cos$1(c);
    return [
      atan2$1(x * sc, z * cc),
      asin$1(z && y * sc / z)
    ];
  }
}

var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
  return sqrt$1(2 / (1 + cxcy));
});

azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
  return 2 * asin$1(z / 2);
});

function azimuthalEqualArea() {
  return projection(azimuthalEqualAreaRaw)
      .scale(124.75)
      .clipAngle(180 - 1e-3);
}

var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
  return (c = acos$1(c)) && c / sin$1(c);
});

azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
  return z;
});

function azimuthalEquidistant() {
  return projection(azimuthalEquidistantRaw)
      .scale(79.4188)
      .clipAngle(180 - 1e-3);
}

function mercatorRaw(lambda, phi) {
  return [lambda, log(tan((halfPi$1 + phi) / 2))];
}

mercatorRaw.invert = function(x, y) {
  return [x, 2 * atan(exp(y)) - halfPi$1];
};

function mercator() {
  return mercatorProjection(mercatorRaw)
      .scale(961 / tau$2);
}

function mercatorProjection(project) {
  var m = projection(project),
      center = m.center,
      scale = m.scale,
      translate = m.translate,
      clipExtent = m.clipExtent,
      x0 = null, y0, x1, y1; // clip extent

  m.scale = function(_) {
    return arguments.length ? (scale(_), reclip()) : scale();
  };

  m.translate = function(_) {
    return arguments.length ? (translate(_), reclip()) : translate();
  };

  m.center = function(_) {
    return arguments.length ? (center(_), reclip()) : center();
  };

  m.clipExtent = function(_) {
    return arguments.length ? ((_ == null ? x0 = y0 = x1 = y1 = null : (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1])), reclip()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  function reclip() {
    var k = pi$2 * scale(),
        t = m(rotation(m.rotate()).invert([0, 0]));
    return clipExtent(x0 == null
        ? [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]] : project === mercatorRaw
        ? [[Math.max(t[0] - k, x0), y0], [Math.min(t[0] + k, x1), y1]]
        : [[x0, Math.max(t[1] - k, y0)], [x1, Math.min(t[1] + k, y1)]]);
  }

  return reclip();
}

function tany(y) {
  return tan((halfPi$1 + y) / 2);
}

function conicConformalRaw(y0, y1) {
  var cy0 = cos$1(y0),
      n = y0 === y1 ? sin$1(y0) : log(cy0 / cos$1(y1)) / log(tany(y1) / tany(y0)),
      f = cy0 * pow(tany(y0), n) / n;

  if (!n) return mercatorRaw;

  function project(x, y) {
    if (f > 0) { if (y < -halfPi$1 + epsilon$2) y = -halfPi$1 + epsilon$2; }
    else { if (y > halfPi$1 - epsilon$2) y = halfPi$1 - epsilon$2; }
    var r = f / pow(tany(y), n);
    return [r * sin$1(n * x), f - r * cos$1(n * x)];
  }

  project.invert = function(x, y) {
    var fy = f - y, r = sign$1(n) * sqrt$1(x * x + fy * fy),
      l = atan2$1(x, abs$1(fy)) * sign$1(fy);
    if (fy * n < 0)
      l -= pi$2 * sign$1(x) * sign$1(fy);
    return [l / n, 2 * atan(pow(f / r, 1 / n)) - halfPi$1];
  };

  return project;
}

function conicConformal() {
  return conicProjection(conicConformalRaw)
      .scale(109.5)
      .parallels([30, 30]);
}

function equirectangularRaw(lambda, phi) {
  return [lambda, phi];
}

equirectangularRaw.invert = equirectangularRaw;

function equirectangular() {
  return projection(equirectangularRaw)
      .scale(152.63);
}

function conicEquidistantRaw(y0, y1) {
  var cy0 = cos$1(y0),
      n = y0 === y1 ? sin$1(y0) : (cy0 - cos$1(y1)) / (y1 - y0),
      g = cy0 / n + y0;

  if (abs$1(n) < epsilon$2) return equirectangularRaw;

  function project(x, y) {
    var gy = g - y, nx = n * x;
    return [gy * sin$1(nx), g - gy * cos$1(nx)];
  }

  project.invert = function(x, y) {
    var gy = g - y,
        l = atan2$1(x, abs$1(gy)) * sign$1(gy);
    if (gy * n < 0)
      l -= pi$2 * sign$1(x) * sign$1(gy);
    return [l / n, g - sign$1(n) * sqrt$1(x * x + gy * gy)];
  };

  return project;
}

function conicEquidistant() {
  return conicProjection(conicEquidistantRaw)
      .scale(131.154)
      .center([0, 13.9389]);
}

var A1 = 1.340264,
    A2 = -0.081106,
    A3 = 0.000893,
    A4 = 0.003796,
    M = sqrt$1(3) / 2,
    iterations = 12;

function equalEarthRaw(lambda, phi) {
  var l = asin$1(M * sin$1(phi)), l2 = l * l, l6 = l2 * l2 * l2;
  return [
    lambda * cos$1(l) / (M * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2))),
    l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2))
  ];
}

equalEarthRaw.invert = function(x, y) {
  var l = y, l2 = l * l, l6 = l2 * l2 * l2;
  for (var i = 0, delta, fy, fpy; i < iterations; ++i) {
    fy = l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2)) - y;
    fpy = A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2);
    l -= delta = fy / fpy, l2 = l * l, l6 = l2 * l2 * l2;
    if (abs$1(delta) < epsilon2) break;
  }
  return [
    M * x * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2)) / cos$1(l),
    asin$1(sin$1(l) / M)
  ];
};

function equalEarth() {
  return projection(equalEarthRaw)
      .scale(177.158);
}

function gnomonicRaw(x, y) {
  var cy = cos$1(y), k = cos$1(x) * cy;
  return [cy * sin$1(x) / k, sin$1(y) / k];
}

gnomonicRaw.invert = azimuthalInvert(atan);

function gnomonic() {
  return projection(gnomonicRaw)
      .scale(144.049)
      .clipAngle(60);
}

function identity$1() {
  var k = 1, tx = 0, ty = 0, sx = 1, sy = 1, // scale, translate and reflect
      alpha = 0, ca, sa, // angle
      x0 = null, y0, x1, y1, // clip extent
      kx = 1, ky = 1,
      transform = transformer({
        point: function(x, y) {
          var p = projection([x, y]);
          this.stream.point(p[0], p[1]);
        }
      }),
      postclip = identity$2,
      cache,
      cacheStream;

  function reset() {
    kx = k * sx;
    ky = k * sy;
    cache = cacheStream = null;
    return projection;
  }

  function projection (p) {
    var x = p[0] * kx, y = p[1] * ky;
    if (alpha) {
      var t = y * ca - x * sa;
      x = x * ca + y * sa;
      y = t;
    }    
    return [x + tx, y + ty];
  }
  projection.invert = function(p) {
    var x = p[0] - tx, y = p[1] - ty;
    if (alpha) {
      var t = y * ca + x * sa;
      x = x * ca - y * sa;
      y = t;
    }
    return [x / kx, y / ky];
  };
  projection.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = transform(postclip(cacheStream = stream));
  };
  projection.postclip = function(_) {
    return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
  };
  projection.clipExtent = function(_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity$2) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };
  projection.scale = function(_) {
    return arguments.length ? (k = +_, reset()) : k;
  };
  projection.translate = function(_) {
    return arguments.length ? (tx = +_[0], ty = +_[1], reset()) : [tx, ty];
  };
  projection.angle = function(_) {
    return arguments.length ? (alpha = _ % 360 * radians, sa = sin$1(alpha), ca = cos$1(alpha), reset()) : alpha * degrees;
  };
  projection.reflectX = function(_) {
    return arguments.length ? (sx = _ ? -1 : 1, reset()) : sx < 0;
  };
  projection.reflectY = function(_) {
    return arguments.length ? (sy = _ ? -1 : 1, reset()) : sy < 0;
  };
  projection.fitExtent = function(extent, object) {
    return fitExtent(projection, extent, object);
  };
  projection.fitSize = function(size, object) {
    return fitSize(projection, size, object);
  };
  projection.fitWidth = function(width, object) {
    return fitWidth(projection, width, object);
  };
  projection.fitHeight = function(height, object) {
    return fitHeight(projection, height, object);
  };

  return projection;
}

function naturalEarth1Raw(lambda, phi) {
  var phi2 = phi * phi, phi4 = phi2 * phi2;
  return [
    lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
    phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)))
  ];
}

naturalEarth1Raw.invert = function(x, y) {
  var phi = y, i = 25, delta;
  do {
    var phi2 = phi * phi, phi4 = phi2 * phi2;
    phi -= delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) /
        (1.007226 + phi2 * (0.015085 * 3 + phi4 * (-0.044475 * 7 + 0.028874 * 9 * phi2 - 0.005916 * 11 * phi4)));
  } while (abs$1(delta) > epsilon$2 && --i > 0);
  return [
    x / (0.8707 + (phi2 = phi * phi) * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2)))),
    phi
  ];
};

function naturalEarth1() {
  return projection(naturalEarth1Raw)
      .scale(175.295);
}

function orthographicRaw(x, y) {
  return [cos$1(y) * sin$1(x), sin$1(y)];
}

orthographicRaw.invert = azimuthalInvert(asin$1);

function orthographic() {
  return projection(orthographicRaw)
      .scale(249.5)
      .clipAngle(90 + epsilon$2);
}

function stereographicRaw(x, y) {
  var cy = cos$1(y), k = 1 + cos$1(x) * cy;
  return [cy * sin$1(x) / k, sin$1(y) / k];
}

stereographicRaw.invert = azimuthalInvert(function(z) {
  return 2 * atan(z);
});

function stereographic() {
  return projection(stereographicRaw)
      .scale(250)
      .clipAngle(142);
}

function transverseMercatorRaw(lambda, phi) {
  return [log(tan((halfPi$1 + phi) / 2)), -lambda];
}

transverseMercatorRaw.invert = function(x, y) {
  return [-y, 2 * atan(exp(x)) - halfPi$1];
};

function transverseMercator() {
  var m = mercatorProjection(transverseMercatorRaw),
      center = m.center,
      rotate = m.rotate;

  m.center = function(_) {
    return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
  };

  m.rotate = function(_) {
    return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
  };

  return rotate([0, 0, 90])
      .scale(159.155);
}

var src$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  geoAlbers: albers,
  geoAlbersUsa: albersUsa,
  geoArea: area$1,
  geoAzimuthalEqualArea: azimuthalEqualArea,
  geoAzimuthalEqualAreaRaw: azimuthalEqualAreaRaw,
  geoAzimuthalEquidistant: azimuthalEquidistant,
  geoAzimuthalEquidistantRaw: azimuthalEquidistantRaw,
  geoBounds: bounds,
  geoCentroid: centroid,
  geoCircle: circle$2,
  geoClipAntimeridian: clipAntimeridian,
  geoClipCircle: clipCircle,
  geoClipExtent: extent,
  geoClipRectangle: clipRectangle,
  geoConicConformal: conicConformal,
  geoConicConformalRaw: conicConformalRaw,
  geoConicEqualArea: conicEqualArea,
  geoConicEqualAreaRaw: conicEqualAreaRaw,
  geoConicEquidistant: conicEquidistant,
  geoConicEquidistantRaw: conicEquidistantRaw,
  geoContains: contains,
  geoDistance: distance,
  geoEqualEarth: equalEarth,
  geoEqualEarthRaw: equalEarthRaw,
  geoEquirectangular: equirectangular,
  geoEquirectangularRaw: equirectangularRaw,
  geoGnomonic: gnomonic,
  geoGnomonicRaw: gnomonicRaw,
  geoGraticule: graticule,
  geoGraticule10: graticule10,
  geoIdentity: identity$1,
  geoInterpolate: interpolate,
  geoLength: length,
  geoMercator: mercator,
  geoMercatorRaw: mercatorRaw,
  geoNaturalEarth1: naturalEarth1,
  geoNaturalEarth1Raw: naturalEarth1Raw,
  geoOrthographic: orthographic,
  geoOrthographicRaw: orthographicRaw,
  geoPath: index,
  geoProjection: projection,
  geoProjectionMutator: projectionMutator,
  geoRotation: rotation,
  geoStereographic: stereographic,
  geoStereographicRaw: stereographicRaw,
  geoStream: geoStream,
  geoTransform: transform,
  geoTransverseMercator: transverseMercator,
  geoTransverseMercatorRaw: transverseMercatorRaw
});

var require$$10 = /*@__PURE__*/getAugmentedNamespace(src$2);

function tree_add(d) {
  var x = +this._x.call(null, d),
      y = +this._y.call(null, d);
  return add(this.cover(x, y), x, y, d);
}

function add(tree, x, y, d) {
  if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

  var parent,
      node = tree._root,
      leaf = {data: d},
      x0 = tree._x0,
      y0 = tree._y0,
      x1 = tree._x1,
      y1 = tree._y1,
      xm,
      ym,
      xp,
      yp,
      right,
      bottom,
      i,
      j;

  // If the tree is empty, initialize the root as a leaf.
  if (!node) return tree._root = leaf, tree;

  // Find the existing leaf for the new point, or add it.
  while (node.length) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  }

  // Is the new point is exactly coincident with the existing point?
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

  // Otherwise, split the leaf node until the old and new point are separated.
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
  return parent[j] = node, parent[i] = leaf, tree;
}

function addAll(data) {
  var d, i, n = data.length,
      x,
      y,
      xz = new Array(n),
      yz = new Array(n),
      x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;

  // Compute the points and their extent.
  for (i = 0; i < n; ++i) {
    if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
    xz[i] = x;
    yz[i] = y;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }

  // If there were no (valid) points, abort.
  if (x0 > x1 || y0 > y1) return this;

  // Expand the tree to cover the new points.
  this.cover(x0, y0).cover(x1, y1);

  // Add the new points.
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }

  return this;
}

function tree_cover(x, y) {
  if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

  var x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1;

  // If the quadtree has no extent, initialize them.
  // Integer extent are necessary so that if we later double the extent,
  // the existing quadrant boundaries don’t change due to floating point error!
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x)) + 1;
    y1 = (y0 = Math.floor(y)) + 1;
  }

  // Otherwise, double repeatedly to cover.
  else {
    var z = x1 - x0,
        node = this._root,
        parent,
        i;

    while (x0 > x || x >= x1 || y0 > y || y >= y1) {
      i = (y < y0) << 1 | (x < x0);
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;
      switch (i) {
        case 0: x1 = x0 + z, y1 = y0 + z; break;
        case 1: x0 = x1 - z, y1 = y0 + z; break;
        case 2: x1 = x0 + z, y0 = y1 - z; break;
        case 3: x0 = x1 - z, y0 = y1 - z; break;
      }
    }

    if (this._root && this._root.length) this._root = node;
  }

  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}

function tree_data() {
  var data = [];
  this.visit(function(node) {
    if (!node.length) do data.push(node.data); while (node = node.next)
  });
  return data;
}

function tree_extent(_) {
  return arguments.length
      ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
      : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
}

function Quad(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

function tree_find(x, y, radius) {
  var data,
      x0 = this._x0,
      y0 = this._y0,
      x1,
      y1,
      x2,
      y2,
      x3 = this._x1,
      y3 = this._y1,
      quads = [],
      node = this._root,
      q,
      i;

  if (node) quads.push(new Quad(node, x0, y0, x3, y3));
  if (radius == null) radius = Infinity;
  else {
    x0 = x - radius, y0 = y - radius;
    x3 = x + radius, y3 = y + radius;
    radius *= radius;
  }

  while (q = quads.pop()) {

    // Stop searching if this quadrant can’t contain a closer node.
    if (!(node = q.node)
        || (x1 = q.x0) > x3
        || (y1 = q.y0) > y3
        || (x2 = q.x1) < x0
        || (y2 = q.y1) < y0) continue;

    // Bisect the current quadrant.
    if (node.length) {
      var xm = (x1 + x2) / 2,
          ym = (y1 + y2) / 2;

      quads.push(
        new Quad(node[3], xm, ym, x2, y2),
        new Quad(node[2], x1, ym, xm, y2),
        new Quad(node[1], xm, y1, x2, ym),
        new Quad(node[0], x1, y1, xm, ym)
      );

      // Visit the closest quadrant first.
      if (i = (y >= ym) << 1 | (x >= xm)) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    }

    // Visit this point. (Visiting coincident points isn’t necessary!)
    else {
      var dx = x - +this._x.call(null, node.data),
          dy = y - +this._y.call(null, node.data),
          d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x - d, y0 = y - d;
        x3 = x + d, y3 = y + d;
        data = node.data;
      }
    }
  }

  return data;
}

function tree_remove(d) {
  if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

  var parent,
      node = this._root,
      retainer,
      previous,
      next,
      x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1,
      x,
      y,
      xm,
      ym,
      right,
      bottom,
      i,
      j;

  // If the tree is empty, initialize the root as a leaf.
  if (!node) return this;

  // Find the leaf node for the point.
  // While descending, also retain the deepest parent with a non-removed sibling.
  if (node.length) while (true) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
    if (!node.length) break;
    if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
  }

  // Find the point to remove.
  while (node.data !== d) if (!(previous = node, node = node.next)) return this;
  if (next = node.next) delete node.next;

  // If there are multiple coincident points, remove just the point.
  if (previous) return (next ? previous.next = next : delete previous.next), this;

  // If this is the root point, remove it.
  if (!parent) return this._root = next, this;

  // Remove this leaf.
  next ? parent[i] = next : delete parent[i];

  // If the parent now contains exactly one leaf, collapse superfluous parents.
  if ((node = parent[0] || parent[1] || parent[2] || parent[3])
      && node === (parent[3] || parent[2] || parent[1] || parent[0])
      && !node.length) {
    if (retainer) retainer[j] = node;
    else this._root = node;
  }

  return this;
}

function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
  return this;
}

function tree_root() {
  return this._root;
}

function tree_size() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length) do ++size; while (node = node.next)
  });
  return size;
}

function tree_visit(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
  if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
    }
  }
  return this;
}

function tree_visitAfter(callback) {
  var quads = [], next = [], q;
  if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}

function defaultX(d) {
  return d[0];
}

function tree_x(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}

function defaultY(d) {
  return d[1];
}

function tree_y(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}

function quadtree(nodes, x, y) {
  var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}

function Quadtree(x, y, x0, y0, x1, y1) {
  this._x = x;
  this._y = y;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = undefined;
}

function leaf_copy(leaf) {
  var copy = {data: leaf.data}, next = copy;
  while (leaf = leaf.next) next = next.next = {data: leaf.data};
  return copy;
}

var treeProto = quadtree.prototype = Quadtree.prototype;

treeProto.copy = function() {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
      node = this._root,
      nodes,
      child;

  if (!node) return copy;

  if (!node.length) return copy._root = leaf_copy(node), copy;

  nodes = [{source: node, target: copy._root = new Array(4)}];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
        else node.target[i] = leaf_copy(child);
      }
    }
  }

  return copy;
};

treeProto.add = tree_add;
treeProto.addAll = addAll;
treeProto.cover = tree_cover;
treeProto.data = tree_data;
treeProto.extent = tree_extent;
treeProto.find = tree_find;
treeProto.remove = tree_remove;
treeProto.removeAll = removeAll;
treeProto.root = tree_root;
treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;

var src$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  quadtree: quadtree
});

var require$$11 = /*@__PURE__*/getAugmentedNamespace(src$1);

var pi$1 = Math.PI,
    tau$1 = 2 * pi$1,
    epsilon$1 = 1e-6,
    tauEpsilon = tau$1 - epsilon$1;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path;
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function(x1, y1, x, y) {
    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon$1));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Otherwise, draw an arc!
    else {
      var x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi$1 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon$1) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }

      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
      this._ += "L" + x0 + "," + y0;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau$1 + tau$1;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon$1) {
      this._ += "A" + r + "," + r + ",0," + (+(da >= pi$1)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
    }
  },
  rect: function(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
  },
  toString: function() {
    return this._;
  }
};

function constant(x) {
  return function constant() {
    return x;
  };
}

var abs = Math.abs;
var atan2 = Math.atan2;
var cos = Math.cos;
var max = Math.max;
var min = Math.min;
var sin = Math.sin;
var sqrt = Math.sqrt;

var epsilon = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var tau = 2 * pi;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0,
      x32 = x3 - x2, y32 = y3 - y2,
      t = y32 * x10 - x32 * y10;
  if (t * t < epsilon) return;
  t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

function arc() {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null;

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfPi,
        a1 = endAngle.apply(this, arguments) - halfPi,
        da = abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau - epsilon) {
      context.moveTo(r1 * cos(a0), r1 * sin(a0));
      context.arc(0, 0, r1, a0, a1, !cw);
      if (r0 > epsilon) {
        context.moveTo(r0 * cos(a1), r0 * sin(a1));
        context.arc(0, 0, r0, a1, a0, cw);
      }
    }

    // Or is it a circular or annular sector?
    else {
      var a01 = a0,
          a11 = a1,
          a00 = a0,
          a10 = a1,
          da0 = da,
          da1 = da,
          ap = padAngle.apply(this, arguments) / 2,
          rp = (ap > epsilon) && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
          rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
          rc0 = rc,
          rc1 = rc,
          t0,
          t1;

      // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
      if (rp > epsilon) {
        var p0 = asin(rp / r0 * sin(ap)),
            p1 = asin(rp / r1 * sin(ap));
        if ((da0 -= p0 * 2) > epsilon) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
        else da0 = 0, a00 = a10 = (a0 + a1) / 2;
        if ((da1 -= p1 * 2) > epsilon) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
        else da1 = 0, a01 = a11 = (a0 + a1) / 2;
      }

      var x01 = r1 * cos(a01),
          y01 = r1 * sin(a01),
          x10 = r0 * cos(a10),
          y10 = r0 * sin(a10);

      // Apply rounded corners?
      if (rc > epsilon) {
        var x11 = r1 * cos(a11),
            y11 = r1 * sin(a11),
            x00 = r0 * cos(a00),
            y00 = r0 * sin(a00),
            oc;

        // Restrict the corner radius according to the sector angle.
        if (da < pi && (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10))) {
          var ax = x01 - oc[0],
              ay = y01 - oc[1],
              bx = x11 - oc[0],
              by = y11 - oc[1],
              kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
              lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = min(rc, (r0 - lc) / (kc - 1));
          rc1 = min(rc, (r1 - lc) / (kc + 1));
        }
      }

      // Is the sector collapsed to a line?
      if (!(da1 > epsilon)) context.moveTo(x01, y01);

      // Does the sector’s outer ring have rounded corners?
      else if (rc1 > epsilon) {
        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
          context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the outer ring just a circular arc?
      else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

      // Is there no inner ring, and it’s a circular sector?
      // Or perhaps it’s an annular sector collapsed due to padding?
      if (!(r0 > epsilon) || !(da0 > epsilon)) context.lineTo(x10, y10);

      // Does the sector’s inner ring (or point) have rounded corners?
      else if (rc0 > epsilon) {
        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
          context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the inner ring just a circular arc?
      else context.arc(0, 0, r0, a10, a00, cw);
    }

    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function() {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi / 2;
    return [cos(a) * r, sin(a) * r];
  };

  arc.innerRadius = function(_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant(+_), arc) : innerRadius;
  };

  arc.outerRadius = function(_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function(_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant(+_), arc) : cornerRadius;
  };

  arc.padRadius = function(_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant(+_), arc) : padRadius;
  };

  arc.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), arc) : startAngle;
  };

  arc.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), arc) : endAngle;
  };

  arc.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), arc) : padAngle;
  };

  arc.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), arc) : context;
  };

  return arc;
}

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // proceed
      default: this._context.lineTo(x, y); break;
    }
  }
};

function curveLinear(context) {
  return new Linear(context);
}

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

function line() {
  var x$1 = x,
      y$1 = y,
      defined = constant(true),
      context = null,
      curve = curveLinear,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function(_) {
    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), line) : x$1;
  };

  line.y = function(_) {
    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), line) : y$1;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}

function area() {
  var x0 = x,
      x1 = null,
      y0 = constant(0),
      y1 = y,
      defined = constant(true),
      context = null,
      curve = curveLinear,
      output = null;

  function area(data) {
    var i,
        j,
        k,
        n = data.length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return line().defined(defined).curve(curve).context(context);
  }

  area.x = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), x1 = null, area) : x0;
  };

  area.x0 = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), area) : x0;
  };

  area.x1 = function(_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : x1;
  };

  area.y = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), y1 = null, area) : y0;
  };

  area.y0 = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), area) : y0;
  };

  area.y1 = function(_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : y1;
  };

  area.lineX0 =
  area.lineY0 = function() {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function() {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function() {
    return arealine().x(x1).y(y0);
  };

  area.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), area) : defined;
  };

  area.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
}

function descending$1(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

function identity(d) {
  return d;
}

function pie() {
  var value = identity,
      sortValues = descending$1,
      sort = null,
      startAngle = constant(0),
      endAngle = constant(tau),
      padAngle = constant(0);

  function pie(data) {
    var i,
        n = data.length,
        j,
        k,
        sum = 0,
        index = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(tau, Math.max(-tau, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }

    // Optionally sort the arcs by previously-computed values or by data.
    if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
    else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

    // Compute the arcs! They are stored in the original data's order.
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pie) : value;
  };

  pie.sortValues = function(_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function(_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), pie) : startAngle;
  };

  pie.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), pie) : endAngle;
  };

  pie.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), pie) : padAngle;
  };

  return pie;
}

var curveRadialLinear = curveRadial$1(curveLinear);

function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function() {
    this._curve.areaStart();
  },
  areaEnd: function() {
    this._curve.areaEnd();
  },
  lineStart: function() {
    this._curve.lineStart();
  },
  lineEnd: function() {
    this._curve.lineEnd();
  },
  point: function(a, r) {
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

function curveRadial$1(curve) {

  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;

  return radial;
}

function lineRadial(l) {
  var c = l.curve;

  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function(_) {
    return arguments.length ? c(curveRadial$1(_)) : c()._curve;
  };

  return l;
}

function lineRadial$1() {
  return lineRadial(line().curve(curveRadialLinear));
}

function areaRadial() {
  var a = area().curve(curveRadialLinear),
      c = a.curve,
      x0 = a.lineX0,
      x1 = a.lineX1,
      y0 = a.lineY0,
      y1 = a.lineY1;

  a.angle = a.x, delete a.x;
  a.startAngle = a.x0, delete a.x0;
  a.endAngle = a.x1, delete a.x1;
  a.radius = a.y, delete a.y;
  a.innerRadius = a.y0, delete a.y0;
  a.outerRadius = a.y1, delete a.y1;
  a.lineStartAngle = function() { return lineRadial(x0()); }, delete a.lineX0;
  a.lineEndAngle = function() { return lineRadial(x1()); }, delete a.lineX1;
  a.lineInnerRadius = function() { return lineRadial(y0()); }, delete a.lineY0;
  a.lineOuterRadius = function() { return lineRadial(y1()); }, delete a.lineY1;

  a.curve = function(_) {
    return arguments.length ? c(curveRadial$1(_)) : c()._curve;
  };

  return a;
}

function pointRadial(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

var slice = Array.prototype.slice;

function linkSource(d) {
  return d.source;
}

function linkTarget(d) {
  return d.target;
}

function link(curve) {
  var source = linkSource,
      target = linkTarget,
      x$1 = x,
      y$1 = y,
      context = null;

  function link() {
    var buffer, argv = slice.call(arguments), s = source.apply(this, argv), t = target.apply(this, argv);
    if (!context) context = buffer = path();
    curve(context, +x$1.apply(this, (argv[0] = s, argv)), +y$1.apply(this, argv), +x$1.apply(this, (argv[0] = t, argv)), +y$1.apply(this, argv));
    if (buffer) return context = null, buffer + "" || null;
  }

  link.source = function(_) {
    return arguments.length ? (source = _, link) : source;
  };

  link.target = function(_) {
    return arguments.length ? (target = _, link) : target;
  };

  link.x = function(_) {
    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), link) : x$1;
  };

  link.y = function(_) {
    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), link) : y$1;
  };

  link.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), link) : context;
  };

  return link;
}

function curveHorizontal(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0 = (x0 + x1) / 2, y0, x0, y1, x1, y1);
}

function curveVertical(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0, y0 = (y0 + y1) / 2, x1, y0, x1, y1);
}

function curveRadial(context, x0, y0, x1, y1) {
  var p0 = pointRadial(x0, y0),
      p1 = pointRadial(x0, y0 = (y0 + y1) / 2),
      p2 = pointRadial(x1, y0),
      p3 = pointRadial(x1, y1);
  context.moveTo(p0[0], p0[1]);
  context.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
}

function linkHorizontal() {
  return link(curveHorizontal);
}

function linkVertical() {
  return link(curveVertical);
}

function linkRadial() {
  var l = link(curveRadial);
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;
  return l;
}

var circle = {
  draw: function(context, size) {
    var r = Math.sqrt(size / pi);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, tau);
  }
};

var cross = {
  draw: function(context, size) {
    var r = Math.sqrt(size / 5) / 2;
    context.moveTo(-3 * r, -r);
    context.lineTo(-r, -r);
    context.lineTo(-r, -3 * r);
    context.lineTo(r, -3 * r);
    context.lineTo(r, -r);
    context.lineTo(3 * r, -r);
    context.lineTo(3 * r, r);
    context.lineTo(r, r);
    context.lineTo(r, 3 * r);
    context.lineTo(-r, 3 * r);
    context.lineTo(-r, r);
    context.lineTo(-3 * r, r);
    context.closePath();
  }
};

var tan30 = Math.sqrt(1 / 3),
    tan30_2 = tan30 * 2;

var diamond = {
  draw: function(context, size) {
    var y = Math.sqrt(size / tan30_2),
        x = y * tan30;
    context.moveTo(0, -y);
    context.lineTo(x, 0);
    context.lineTo(0, y);
    context.lineTo(-x, 0);
    context.closePath();
  }
};

var ka = 0.89081309152928522810,
    kr = Math.sin(pi / 10) / Math.sin(7 * pi / 10),
    kx = Math.sin(tau / 10) * kr,
    ky = -Math.cos(tau / 10) * kr;

var star = {
  draw: function(context, size) {
    var r = Math.sqrt(size * ka),
        x = kx * r,
        y = ky * r;
    context.moveTo(0, -r);
    context.lineTo(x, y);
    for (var i = 1; i < 5; ++i) {
      var a = tau * i / 5,
          c = Math.cos(a),
          s = Math.sin(a);
      context.lineTo(s * r, -c * r);
      context.lineTo(c * x - s * y, s * x + c * y);
    }
    context.closePath();
  }
};

var square = {
  draw: function(context, size) {
    var w = Math.sqrt(size),
        x = -w / 2;
    context.rect(x, x, w, w);
  }
};

var sqrt3 = Math.sqrt(3);

var triangle = {
  draw: function(context, size) {
    var y = -Math.sqrt(size / (sqrt3 * 3));
    context.moveTo(0, y * 2);
    context.lineTo(-sqrt3 * y, -y);
    context.lineTo(sqrt3 * y, -y);
    context.closePath();
  }
};

var c = -0.5,
    s = Math.sqrt(3) / 2,
    k = 1 / Math.sqrt(12),
    a = (k / 2 + 1) * 3;

var wye = {
  draw: function(context, size) {
    var r = Math.sqrt(size / a),
        x0 = r / 2,
        y0 = r * k,
        x1 = x0,
        y1 = r * k + r,
        x2 = -x1,
        y2 = y1;
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
    context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
    context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
    context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
    context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
    context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
    context.closePath();
  }
};

var symbols = [
  circle,
  cross,
  diamond,
  square,
  star,
  triangle,
  wye
];

function symbol() {
  var type = constant(circle),
      size = constant(64),
      context = null;

  function symbol() {
    var buffer;
    if (!context) context = buffer = path();
    type.apply(this, arguments).draw(context, +size.apply(this, arguments));
    if (buffer) return context = null, buffer + "" || null;
  }

  symbol.type = function(_) {
    return arguments.length ? (type = typeof _ === "function" ? _ : constant(_), symbol) : type;
  };

  symbol.size = function(_) {
    return arguments.length ? (size = typeof _ === "function" ? _ : constant(+_), symbol) : size;
  };

  symbol.context = function(_) {
    return arguments.length ? (context = _ == null ? null : _, symbol) : context;
  };

  return symbol;
}

function noop() {}

function point$3(that, x, y) {
  that._context.bezierCurveTo(
    (2 * that._x0 + that._x1) / 3,
    (2 * that._y0 + that._y1) / 3,
    (that._x0 + 2 * that._x1) / 3,
    (that._y0 + 2 * that._y1) / 3,
    (that._x0 + 4 * that._x1 + x) / 6,
    (that._y0 + 4 * that._y1 + y) / 6
  );
}

function Basis(context) {
  this._context = context;
}

Basis.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3: point$3(this, this._x1, this._y1); // proceed
      case 2: this._context.lineTo(this._x1, this._y1); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
      default: point$3(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function basis(context) {
  return new Basis(context);
}

function BasisClosed(context) {
  this._context = context;
}

BasisClosed.prototype = {
  areaStart: noop,
  areaEnd: noop,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 =
    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
        this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2);
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._x2 = x, this._y2 = y; break;
      case 1: this._point = 2; this._x3 = x, this._y3 = y; break;
      case 2: this._point = 3; this._x4 = x, this._y4 = y; this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6); break;
      default: point$3(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function basisClosed(context) {
  return new BasisClosed(context);
}

function BasisOpen(context) {
  this._context = context;
}

BasisOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6; this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0); break;
      case 3: this._point = 4; // proceed
      default: point$3(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function basisOpen(context) {
  return new BasisOpen(context);
}

function Bundle(context, beta) {
  this._basis = new Basis(context);
  this._beta = beta;
}

Bundle.prototype = {
  lineStart: function() {
    this._x = [];
    this._y = [];
    this._basis.lineStart();
  },
  lineEnd: function() {
    var x = this._x,
        y = this._y,
        j = x.length - 1;

    if (j > 0) {
      var x0 = x[0],
          y0 = y[0],
          dx = x[j] - x0,
          dy = y[j] - y0,
          i = -1,
          t;

      while (++i <= j) {
        t = i / j;
        this._basis.point(
          this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
          this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
        );
      }
    }

    this._x = this._y = null;
    this._basis.lineEnd();
  },
  point: function(x, y) {
    this._x.push(+x);
    this._y.push(+y);
  }
};

var bundle = (function custom(beta) {

  function bundle(context) {
    return beta === 1 ? new Basis(context) : new Bundle(context, beta);
  }

  bundle.beta = function(beta) {
    return custom(+beta);
  };

  return bundle;
})(0.85);

function point$2(that, x, y) {
  that._context.bezierCurveTo(
    that._x1 + that._k * (that._x2 - that._x0),
    that._y1 + that._k * (that._y2 - that._y0),
    that._x2 + that._k * (that._x1 - x),
    that._y2 + that._k * (that._y1 - y),
    that._x2,
    that._y2
  );
}

function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

Cardinal.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x2, this._y2); break;
      case 3: point$2(this, this._x1, this._y1); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
      case 2: this._point = 3; // proceed
      default: point$2(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var cardinal = (function custom(tension) {

  function cardinal(context) {
    return new Cardinal(context, tension);
  }

  cardinal.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function CardinalClosed(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalClosed.prototype = {
  areaStart: noop,
  areaEnd: noop,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
      case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
      case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
      default: point$2(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var cardinalClosed = (function custom(tension) {

  function cardinal(context) {
    return new CardinalClosed(context, tension);
  }

  cardinal.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function CardinalOpen(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
      case 3: this._point = 4; // proceed
      default: point$2(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var cardinalOpen = (function custom(tension) {

  function cardinal(context) {
    return new CardinalOpen(context, tension);
  }

  cardinal.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function point$1(that, x, y) {
  var x1 = that._x1,
      y1 = that._y1,
      x2 = that._x2,
      y2 = that._y2;

  if (that._l01_a > epsilon) {
    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
  }

  if (that._l23_a > epsilon) {
    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
  }

  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
}

function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRom.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x2, this._y2); break;
      case 3: this.point(this._x2, this._y2); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; // proceed
      default: point$1(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var catmullRom = (function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
  }

  catmullRom.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function CatmullRomClosed(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomClosed.prototype = {
  areaStart: noop,
  areaEnd: noop,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
      case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
      case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
      default: point$1(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var catmullRomClosed = (function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
  }

  catmullRom.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function CatmullRomOpen(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
      case 3: this._point = 4; // proceed
      default: point$1(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var catmullRomOpen = (function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
  }

  catmullRom.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function LinearClosed(context) {
  this._context = context;
}

LinearClosed.prototype = {
  areaStart: noop,
  areaEnd: noop,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._point) this._context.closePath();
  },
  point: function(x, y) {
    x = +x, y = +y;
    if (this._point) this._context.lineTo(x, y);
    else this._point = 1, this._context.moveTo(x, y);
  }
};

function linearClosed(context) {
  return new LinearClosed(context);
}

function sign(x) {
  return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

// Calculate a one-sided slope.
function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}

// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function point(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 =
    this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x1, this._y1); break;
      case 3: point(this, this._t0, slope2(this, this._t0)); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    var t1 = NaN;

    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; point(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
      default: point(this, this._t0, t1 = slope3(this, x, y)); break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function(x, y) { this._context.moveTo(y, x); },
  closePath: function() { this._context.closePath(); },
  lineTo: function(x, y) { this._context.lineTo(y, x); },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
};

function monotoneX(context) {
  return new MonotoneX(context);
}

function monotoneY(context) {
  return new MonotoneY(context);
}

function Natural(context) {
  this._context = context;
}

Natural.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [];
    this._y = [];
  },
  lineEnd: function() {
    var x = this._x,
        y = this._y,
        n = x.length;

    if (n) {
      this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
      if (n === 2) {
        this._context.lineTo(x[1], y[1]);
      } else {
        var px = controlPoints(x),
            py = controlPoints(y);
        for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
        }
      }
    }

    if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function(x, y) {
    this._x.push(+x);
    this._y.push(+y);
  }
};

// See https://www.particleincell.com/2012/bezier-splines/ for derivation.
function controlPoints(x) {
  var i,
      n = x.length - 1,
      m,
      a = new Array(n),
      b = new Array(n),
      r = new Array(n);
  a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
  for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
  a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
  for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
  a[n - 1] = r[n - 1] / b[n - 1];
  for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
  b[n - 1] = (x[n] + a[n - 1]) / 2;
  for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
  return [a, b];
}

function natural(context) {
  return new Natural(context);
}

function Step(context, t) {
  this._context = context;
  this._t = t;
}

Step.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // proceed
      default: {
        if (this._t <= 0) {
          this._context.lineTo(this._x, y);
          this._context.lineTo(x, y);
        } else {
          var x1 = this._x * (1 - this._t) + x * this._t;
          this._context.lineTo(x1, this._y);
          this._context.lineTo(x1, y);
        }
        break;
      }
    }
    this._x = x, this._y = y;
  }
};

function step(context) {
  return new Step(context, 0.5);
}

function stepBefore(context) {
  return new Step(context, 0);
}

function stepAfter(context) {
  return new Step(context, 1);
}

function none$1(series, order) {
  if (!((n = series.length) > 1)) return;
  for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
    s0 = s1, s1 = series[order[i]];
    for (j = 0; j < m; ++j) {
      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
    }
  }
}

function none(series) {
  var n = series.length, o = new Array(n);
  while (--n >= 0) o[n] = n;
  return o;
}

function stackValue(d, key) {
  return d[key];
}

function stack() {
  var keys = constant([]),
      order = none,
      offset = none$1,
      value = stackValue;

  function stack(data) {
    var kz = keys.apply(this, arguments),
        i,
        m = data.length,
        n = kz.length,
        sz = new Array(n),
        oz;

    for (i = 0; i < n; ++i) {
      for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
        si[j] = sij = [0, +value(data[j], ki, j, data)];
        sij.data = data[j];
      }
      si.key = ki;
    }

    for (i = 0, oz = order(sz); i < n; ++i) {
      sz[oz[i]].index = i;
    }

    offset(sz, oz);
    return sz;
  }

  stack.keys = function(_) {
    return arguments.length ? (keys = typeof _ === "function" ? _ : constant(slice.call(_)), stack) : keys;
  };

  stack.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), stack) : value;
  };

  stack.order = function(_) {
    return arguments.length ? (order = _ == null ? none : typeof _ === "function" ? _ : constant(slice.call(_)), stack) : order;
  };

  stack.offset = function(_) {
    return arguments.length ? (offset = _ == null ? none$1 : _, stack) : offset;
  };

  return stack;
}

function expand(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
    for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
    if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
  }
  none$1(series, order);
}

function diverging(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
    for (yp = yn = 0, i = 0; i < n; ++i) {
      if ((dy = (d = series[order[i]][j])[1] - d[0]) > 0) {
        d[0] = yp, d[1] = yp += dy;
      } else if (dy < 0) {
        d[1] = yn, d[0] = yn += dy;
      } else {
        d[0] = 0, d[1] = dy;
      }
    }
  }
}

function silhouette(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
    for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
    s0[j][1] += s0[j][0] = -y / 2;
  }
  none$1(series, order);
}

function wiggle(series, order) {
  if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
  for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
    for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
      var si = series[order[i]],
          sij0 = si[j][1] || 0,
          sij1 = si[j - 1][1] || 0,
          s3 = (sij0 - sij1) / 2;
      for (var k = 0; k < i; ++k) {
        var sk = series[order[k]],
            skj0 = sk[j][1] || 0,
            skj1 = sk[j - 1][1] || 0;
        s3 += skj0 - skj1;
      }
      s1 += sij0, s2 += s3 * sij0;
    }
    s0[j - 1][1] += s0[j - 1][0] = y;
    if (s1) y -= s2 / s1;
  }
  s0[j - 1][1] += s0[j - 1][0] = y;
  none$1(series, order);
}

function appearance(series) {
  var peaks = series.map(peak);
  return none(series).sort(function(a, b) { return peaks[a] - peaks[b]; });
}

function peak(series) {
  var i = -1, j = 0, n = series.length, vi, vj = -Infinity;
  while (++i < n) if ((vi = +series[i][1]) > vj) vj = vi, j = i;
  return j;
}

function ascending(series) {
  var sums = series.map(sum);
  return none(series).sort(function(a, b) { return sums[a] - sums[b]; });
}

function sum(series) {
  var s = 0, i = -1, n = series.length, v;
  while (++i < n) if (v = +series[i][1]) s += v;
  return s;
}

function descending(series) {
  return ascending(series).reverse();
}

function insideOut(series) {
  var n = series.length,
      i,
      j,
      sums = series.map(sum),
      order = appearance(series),
      top = 0,
      bottom = 0,
      tops = [],
      bottoms = [];

  for (i = 0; i < n; ++i) {
    j = order[i];
    if (top < bottom) {
      top += sums[j];
      tops.push(j);
    } else {
      bottom += sums[j];
      bottoms.push(j);
    }
  }

  return bottoms.reverse().concat(tops);
}

function reverse(series) {
  return none(series).reverse();
}

var src = /*#__PURE__*/Object.freeze({
  __proto__: null,
  arc: arc,
  area: area,
  areaRadial: areaRadial,
  curveBasis: basis,
  curveBasisClosed: basisClosed,
  curveBasisOpen: basisOpen,
  curveBundle: bundle,
  curveCardinal: cardinal,
  curveCardinalClosed: cardinalClosed,
  curveCardinalOpen: cardinalOpen,
  curveCatmullRom: catmullRom,
  curveCatmullRomClosed: catmullRomClosed,
  curveCatmullRomOpen: catmullRomOpen,
  curveLinear: curveLinear,
  curveLinearClosed: linearClosed,
  curveMonotoneX: monotoneX,
  curveMonotoneY: monotoneY,
  curveNatural: natural,
  curveStep: step,
  curveStepAfter: stepAfter,
  curveStepBefore: stepBefore,
  line: line,
  lineRadial: lineRadial$1,
  linkHorizontal: linkHorizontal,
  linkRadial: linkRadial,
  linkVertical: linkVertical,
  pie: pie,
  pointRadial: pointRadial,
  radialArea: areaRadial,
  radialLine: lineRadial$1,
  stack: stack,
  stackOffsetDiverging: diverging,
  stackOffsetExpand: expand,
  stackOffsetNone: none$1,
  stackOffsetSilhouette: silhouette,
  stackOffsetWiggle: wiggle,
  stackOrderAppearance: appearance,
  stackOrderAscending: ascending,
  stackOrderDescending: descending,
  stackOrderInsideOut: insideOut,
  stackOrderNone: none,
  stackOrderReverse: reverse,
  symbol: symbol,
  symbolCircle: circle,
  symbolCross: cross,
  symbolDiamond: diamond,
  symbolSquare: square,
  symbolStar: star,
  symbolTriangle: triangle,
  symbolWye: wye,
  symbols: symbols
});

var require$$12 = /*@__PURE__*/getAugmentedNamespace(src);

var require$$13 = /*@__PURE__*/getAugmentedNamespace(src$8);

/*!
 * /*
 * taucharts@2.8.0 (2020-02-26)
 * Copyright 2020 Targetprocess, Inc.
 * Licensed under Apache License 2.0
 * * /
 * 
 */
var taucharts = taucharts$1.exports;

var hasRequiredTaucharts;

function requireTaucharts () {
	if (hasRequiredTaucharts) return taucharts$1.exports;
	hasRequiredTaucharts = 1;
	(function (module, exports) {
		!function(t,e){"object"=='object'&&"object"=='object'?module.exports=e(require$$1$2,require$$1$1,require$$2,require$$3,require$$4,require$$1,require$$6,require$$7,require$$8,require$$9,require$$10,require$$11,require$$12,require$$13):"function"==typeof undefined&&undefined.amd?undefined(["d3-selection","d3-array","d3-scale","topojson-client","d3-transition","d3-format","d3-time-format","d3-brush","d3-color","d3-axis","d3-geo","d3-quadtree","d3-shape","d3-time"],e):"object"=='object'?exports.Taucharts=e(require$$1$2,require$$1$1,require$$2,require$$3,require$$4,require$$1,require$$6,require$$7,require$$8,require$$9,require$$10,require$$11,require$$12,require$$13):t.Taucharts=e(t.d3,t.d3,t.d3,t.topojson,t.d3,t.d3,t.d3,t.d3,t.d3,t.d3,t.d3,t.d3,t.d3,t.d3);}(window,(function(t,e,n,r,i,o,a,u,s,c,l,f,d,h){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=20)}([function(e,n){e.exports=t;},function(t,e,n){"use strict";n.r(e);var r={};n.r(r),n.d(r,"traverseJSON",(function(){return vt})),n.d(r,"traverseSpec",(function(){return bt})),n.d(r,"clone",(function(){return Ct})),n.d(r,"isDate",(function(){return Nt})),n.d(r,"isObject",(function(){return Lt})),n.d(r,"niceZeroBased",(function(){return jt})),n.d(r,"niceTimeDomain",(function(){return Pt})),n.d(r,"generateHash",(function(){return Rt})),n.d(r,"generateRatioFunction",(function(){return Dt})),n.d(r,"isSpecRectCoordsOnly",(function(){return It})),n.d(r,"throttleLastEvent",(function(){return Bt})),n.d(r,"splitEvenly",(function(){return Wt})),n.d(r,"extRGBColor",(function(){return Ht})),n.d(r,"extCSSClass",(function(){return Ut})),n.d(r,"toRadian",(function(){return Gt})),n.d(r,"normalizeAngle",(function(){return qt})),n.d(r,"range",(function(){return Xt})),n.d(r,"hasXOverflow",(function(){return Yt})),n.d(r,"hasYOverflow",(function(){return Vt})),n.d(r,"flatten",(function(){return $t})),n.d(r,"unique",(function(){return Jt})),n.d(r,"groupBy",(function(){return Kt})),n.d(r,"union",(function(){return Zt})),n.d(r,"intersection",(function(){return Qt})),n.d(r,"defaults",(function(){return te})),n.d(r,"omit",(function(){return ee})),n.d(r,"memoize",(function(){return ne})),n.d(r,"createMultiSorter",(function(){return re})),n.d(r,"pick",(function(){return ie})),n.d(r,"escape",(function(){return oe})),n.d(r,"template",(function(){return ae})),n.d(r,"escapeHtml",(function(){return ue})),n.d(r,"xml",(function(){return ce})),n.d(r,"take",(function(){return le})),n.d(r,"isChartElement",(function(){return de})),n.d(r,"isFacetUnit",(function(){return he}));var i={};n.r(i),n.d(i,"appendTo",(function(){return me})),n.d(i,"getScrollbarSize",(function(){return ye})),n.d(i,"setScrollPadding",(function(){return ve})),n.d(i,"getStyle",(function(){return be})),n.d(i,"getStyleAsNum",(function(){return xe})),n.d(i,"getContainerSize",(function(){return _e})),n.d(i,"getAxisTickLabelSize",(function(){return we})),n.d(i,"getLabelSize",(function(){return Se})),n.d(i,"getCharSize",(function(){return Me})),n.d(i,"selectOrAppend",(function(){return Oe})),n.d(i,"selectImmediate",(function(){return ke})),n.d(i,"selectAllImmediate",(function(){return Ae})),n.d(i,"sortChildren",(function(){return Te})),n.d(i,"classes",(function(){return Ee})),n.d(i,"dispatchMouseEvent",(function(){return Ce}));var o={};n.r(o),n.d(o,"translate",(function(){return Ne})),n.d(o,"rotate",(function(){return Le})),n.d(o,"getOrientation",(function(){return je})),n.d(o,"parseTransformTranslate",(function(){return Pe})),n.d(o,"isIntersect",(function(){return Fe})),n.d(o,"getDeepTransformTranslate",(function(){return ze})),n.d(o,"raiseElements",(function(){return Re}));var a=n(0),u=n(2),s=n(3),c={},l={};function f(t){var e=l[t];return e||(e=function(){for(var e,n,r=this,i=0,o=[];r=r.handler;){if("function"==typeof(n=r.callbacks[t])){if(!e)for(e=[this],i=0;i<arguments.length;i++)e.push(arguments[i]);o.unshift({fn:n,context:r.context,args:e});}if("function"==typeof(n=r.callbacks["*"])){if(!e)for(e=[this],i=0;i<arguments.length;i++)e.push(arguments[i]);o.unshift({fn:n,context:r.context,args:[{sender:this,type:t,args:e}]});}}o.forEach((function(t){return t.fn.apply(t.context,t.args)}));},l[t]=e),e}var d,h=function(){function t(){this.handler=null,this.emit_destroy=f("destroy");}return t.prototype.addHandler=function(t,e){e=e||this,this.handler={callbacks:t,context:e,handler:this.handler};},t.prototype.on=function(t,e,n){var r={};return r[t]=e,this.addHandler(r,n),r},t.prototype.fire=function(t,e){f.call(this,t).call(this,e);},t.prototype.removeHandler=function(t,e){var n,r=this;for(e=e||this;n=r,r=r.handler;)if(r.callbacks===t&&r.context===e)return r.callbacks=c,void(n.handler=r.handler)},t.prototype.destroy=function(){this.emit_destroy(),this.handler=null;},t}(),p=(d=function(t,e){return (d=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(t,e)},function(t,e){function n(){this.constructor=t;}d(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n);}),g=function(){return (g=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},m=(g({},a),function(t){function e(e){var n=t.call(this)||this;return n.screenModel=null,n._elementNameSpace=e.namespace||"default",n._elementScalesHub={},n}return p(e,t),e.prototype.regScale=function(t,e){return this._elementScalesHub[t]=e,this},e.prototype.getScale=function(t){return this._elementScalesHub[t]||null},e.prototype.fireNameSpaceEvent=function(t,e){var n=this._elementNameSpace;this.fire(t+"."+n,e);},e.prototype.subscribe=function(t,e,n){void 0===e&&(e=function(t){return t}),void 0===n&&(n=function(t){return t});var r=this,i={};[{event:"mouseover",limit:0},{event:"mouseout",limit:0},{event:"click",limit:0},{event:"mousemove",limit:"requestAnimationFrame"}].forEach((function(o){var u=o.event,s=o.limit;t.on(u,Bt(i,u,(function(t){var i={data:e.call(this,t),event:n.call(this,a.event,t)};r.fire(u,i),r.fireNameSpaceEvent(u,i);}),s));}));},e.prototype.allocateRect=function(){return {left:0,top:0,width:0,height:0}},e.prototype.defineGrammarModel=function(t){return {}},e.prototype.getGrammarRules=function(){return []},e.prototype.getAdjustScalesRules=function(){return []},e.prototype.createScreenModel=function(t){return null},e.prototype.getClosestElement=function(t,e){return null},e.prototype.addInteraction=function(){},e.prototype.draw=function(){this.config.options.container=this.config.options.slot(this.config.uid),this.drawFrames(this.config.frames);},e.prototype.data=function(){return this.config.frames.reduce((function(t,e){return t.concat(e.part())}),[])},e.prototype.node=function(){return this},e}(h)),y=function(t){return {day:{cast:function(e){var n=new Date(e);return new Date(n[t.setHours](0,0,0,0))},next:function(e){var n=new Date(e),r=new Date(n[t.setDate](n[t.getDate]()+1));return this.cast(r)}},week:{cast:function(e){var n=new Date(e);return n=new Date(n[t.setHours](0,0,0,0)),new Date(n[t.setDate](n[t.getDate]()-n[t.getDay]()))},next:function(e){var n=new Date(e),r=new Date(n[t.setDate](n[t.getDate]()+7));return this.cast(r)}},month:{cast:function(e){var n=new Date(e);return n=new Date(n[t.setHours](0,0,0,0)),n=new Date(n[t.setDate](1))},next:function(e){var n=new Date(e),r=new Date(n[t.setMonth](n[t.getMonth]()+1));return this.cast(r)}},quarter:{cast:function(e){var n=new Date(e);n=new Date(n[t.setHours](0,0,0,0));var r=(n=new Date(n[t.setDate](1)))[t.getMonth](),i=r-r%3;return new Date(n[t.setMonth](i))},next:function(e){var n=new Date(e),r=new Date(n[t.setMonth](n[t.getMonth]()+3));return this.cast(r)}},year:{cast:function(e){var n=new Date(e);return n=new Date(n[t.setHours](0,0,0,0)),n=new Date(n[t.setDate](1)),n=new Date(n[t.setMonth](0))},next:function(e){var n=new Date(e),r=new Date(n[t.setFullYear](n[t.getFullYear]()+1));return this.cast(r)}}}},v=y({setHours:"setHours",setDate:"setDate",getDate:"getDate",setMonth:"setMonth",getDay:"getDay",getMonth:"getMonth",setFullYear:"setFullYear",getFullYear:"getFullYear"}),b=y({setHours:"setUTCHours",setDate:"setUTCDate",getDate:"getUTCDate",setMonth:"setUTCMonth",getDay:"getUTCDay",getMonth:"getUTCMonth",setFullYear:"setUTCFullYear",getFullYear:"getUTCFullYear"}),x={add:function(t,e,n){return ((void 0===n?{utc:!1}:n).utc?b:v)[t.toLowerCase()]=e,this},get:function(t,e){return ((void 0===e?{utc:!1}:e).utc?b:v)[(t||"").toLowerCase()]||null},generate:function(t,e,n,r){var i=(void 0===r?{utc:!1}:r).utc,o=[],a=x.get(n,{utc:i});if(a){var u=a.cast(new Date(e)),s=a.cast(new Date(t));for(o.push(s);(s=a.next(new Date(s)))<=u;)o.push(s);}return o}},_=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),w=function(t){function e(e,n,r){var i=t.call(this)||this;return i.name="TauChartError",i.message=e,i.errorCode=n,i.errorArgs=r,i}return _(e,t),e}(Error),S={STACKED_FIELD_NOT_NUMBER:"STACKED_FIELD_NOT_NUMBER",NO_DATA:"NO_DATA",NOT_SUPPORTED_TYPE_CHART:"NOT_SUPPORTED_TYPE_CHART",UNKNOWN_UNIT_TYPE:"UNKNOWN_UNIT_TYPE",INVALID_LOG_DOMAIN:"INVALID_LOG_DOMAIN"},M={},O={get:function(t){return M[t]},reg:function(t,e){return M[t]=e,this}},k="taucharts_synthetic_record";O.reg("identity",(function(){return {}})).reg("flip",(function(t){var e=t.scaleY,n=t.scaleX,r=n.domain(),i=n.discrete?r[0]:Math.max(0,Math.min.apply(Math,r)),o=n.value(i)+-.5*n.stepSize(i);return {flip:!0,scaleX:e,scaleY:n,xi:function(t){return e.value(t[e.dim])},yi:function(t){return n.value(t[n.dim])},y0:function(){return o}}})).reg("obsoleteVerticalStackOrder",(function(){return {obsoleteVerticalStackOrder:!0}})).reg("positioningByColor",(function(t){return (t.scaleX.discrete?function(t){var e=t.data().reduce((function(e,n){var r=n[t.scaleX.dim],i=n[t.scaleColor.dim];return e.hasOwnProperty(r)||(e[r]=[]),e[r].indexOf(i)<0&&e[r].push(i),e}),{}),n=t.scaleX,r=t.scaleColor,i=r.discrete?r.domain():r.originalSeries().sort((function(t,e){return t-e})),o=i.length||1,a=i.reduce((function(t,e,n){return t[e]=n,t}),{});return Object.keys(e).forEach((function(t){return e[t].sort((function(t,e){return a[t]-a[e]}))})),{xi:function(r){var i=r[t.scaleX.dim],a=e[i]||[r[t.scaleColor.dim]],u=a.length,s=a.indexOf(r[t.scaleColor.dim]),c=function(t){return n.stepSize(t[n.dim])*(o/(1+o))}(r)/(o+1);return t.xi(r)-(u+1)*c/2+(1+s)*c}}}:function(){return {}})(t)})).reg("groupOrderByAvg",(function(t){var e=t.data(),n=e.reduce((function(e,n){var r=t.group(n);return e[r]=e[r]||[],e[r].push(n),e}),{}),r=Object.keys(n).map((function(e){return [e,(r=n[e],r.map(t.yi).reduce((function(t,e){return t+e}),0)/r.length)];var r;})).sort((function(t,e){return t[1]-e[1]})).map((function(t){return t[0]}));return {order:function(t){var e=r.indexOf(t);return e<0?Number.MAX_VALUE:e}}})).reg("stack",(function(t){var e=t.data(),n=t.scaleX,r=t.scaleY;if(r.discrete||r.domain().some((function(t){return "number"!=typeof t})))throw new w("Stacked field ["+r.dim+"] should be a number",S.STACKED_FIELD_NOT_NUMBER,{field:r.dim});var i=function(t){return function(e){var i=e[n.dim],o=e[r.dim],a=o>=0?t.positive:t.negative,u=a[i]||0,s=u+o;return a[i]=s,{nextStack:s,prevStack:u}}},o=i({positive:{},negative:{}}),a=i({positive:{},negative:{}}),u=function(e){return ne(e,t.id)},s=Number.MAX_VALUE,c=Number.MIN_VALUE,l=function(t){return s=t<s?t:s,c=t>c?t:c,r.value(t)},f=u((function(t){return l(o(t).nextStack)})),d=u((function(t){return l(a(t).prevStack)})),h=function(e){return t.group(e)+"/"+(e[r.dim]>=0?1:-1)},p=Kt(e,h),g=Object.keys(p).sort(t.flip||!t.flip&&t.obsoleteVerticalStackOrder?function(e,n){return t.order(e)-t.order(n)}:function(e,n){return t.order(n)-t.order(e)}).reduce((function(t,e){return t.concat(p[e])}),[]);return g.forEach((function(t){f(t),d(t);})),r.fixup((function(t){var e={};return (!t.hasOwnProperty("max")||t.max<c)&&(e.max=c),(!t.hasOwnProperty("min")||t.min>s)&&(e.min=s),e})),{group:h,data:function(){return g},yi:f,y0:d}})).reg("size_distribute_evenly",(function(t,e){var n=e.minLimit,r=e.maxLimit,i=e.defMin,o=e.defMax,a=t.data(),u=function(t,e){return t-e},s=t.scaleX.discrete?t.scaleX.stepSize()/2:Number.MAX_VALUE,c=a.map((function(e){return t.xi(e)})).sort(u),l=c[0],f=c.slice(1).map((function(t){var e=t-l;return l=t,e})).filter((function(t){return t>0})).sort(u).concat(Number.MAX_VALUE)[0],d=Math.min(f,s),h="number"==typeof n?n:i,p={minSize:h,maxSize:"number"==typeof r?r:Math.max(h,Math.min(o,d))};return t.scaleSize.fixup((function(t){var e={};return t.fixed?t.maxSize>p.maxSize&&(e.maxSize=p.maxSize):(e.fixed=!0,e.minSize=p.minSize,e.maxSize=p.maxSize),e})),{}})).reg("adjustStaticSizeScale",(function(t,e){var n=e.minLimit,r=e.maxLimit,i=e.defMin,o=e.defMax,a={minSize:"number"==typeof n?n:i,maxSize:"number"==typeof r?r:o};return t.scaleSize.fixup((function(t){var e={};return t.fixed||(e.fixed=!0,e.minSize=a.minSize,e.maxSize=a.maxSize),e})),{}})).reg("adjustSigmaSizeScale",(function(t,e){var n,r,i,o,a=e.minLimit,u=e.maxLimit,s=e.defMin,c=e.defMax,l=function(t,e){return t-e},f=t.data().map((function(e){return t.xi(e)})).sort(l),d=f[0],h=f.slice(1).map((function(t){var e=t-d;return d=t,e})).filter((function(t){return t>0})).sort(l).concat(Number.MAX_VALUE)[0],p=t.scaleX.discrete?t.scaleX.stepSize()/2:Number.MAX_VALUE,g=Math.min(h,p),m="number"==typeof a?a:s,y="number"==typeof u?u:c,v={minSize:m,maxSize:Math.max(m,Math.min(y,(n=g,r=(m+y)/2,i=y,o=m,Math.round(r+(i-r)/(1+Math.exp(-(n-o)/.5))))))};return t.scaleSize.fixup((function(t){var e={};return t.fixed?t.maxSize>v.maxSize&&(e.maxSize=v.maxSize):(e.fixed=!0,e.minSize=v.minSize,e.maxSize=v.maxSize),e})),{}})).reg("avoidScalesOverflow",(function(t,e){var n,r,i=e.sizeDirection,o=function(t,e){return !t||t.discrete||"logarithmic"===t.scaleType||i.indexOf(e)<0},a=o(t.scaleX,"x"),u=o(t.scaleY,"y");if(a&&u)return {};t.scaleSize.fixup((function(t){return n=t.minSize,r=t.maxSize,t}));var s=t.data().reduce((function(e,i){var o,s,c=t.size(i),l=(c>=n?c:n+c*(r-n))/2;return a||(o=t.xi(i),e.left=Math.min(e.left,o-l),e.right=Math.max(e.right,o+l)),u||(s=t.yi(i),e.top=Math.min(e.top,s-l),e.bottom=Math.max(e.bottom,s+l)),e}),{top:Number.MAX_VALUE,right:-Number.MAX_VALUE,bottom:-Number.MAX_VALUE,left:Number.MAX_VALUE}),c=function(e,n,r,i){var o=e.domain(),a=Math.abs(e.value(o[1])-e.value(o[0])),u=(o[1]-o[0])/a;if(0===a)return 1;var s=Math.max(0,-n),c=Math.max(0,r-a),l=t.flip?c:s,f=t.flip?s:c,d=Number(o[0])-(i?f:l)*u,h=Number(o[1])+(i?l:f)*u;return e.fixup((function(t){var e={};if(t.fixedBorders){var i=t.fixedBorders.slice(),o=i[0],a=i[1];(o>n||a<r)&&(e.min=Math.min(t.min,d),e.max=Math.max(t.max,h),o=Math.min(n,o),a=Math.max(r,a)),e.fixedBorders=[o,a];}else e.fixed=!0,e.min=d,e.max=h,e.nice=!1,e.fixedBorders=[n,r];return e})),a/(l+a+f)},l=a?1:c(t.scaleX,s.left,s.right,!1),f=u?1:c(t.scaleY,s.top,s.bottom,!0),d=Math.min(n*l,n*f),h=Math.min(r*l,r*f);return t.scaleSize.fixup((function(){return {minSize:d,maxSize:h}})),{}})).reg("fillGaps",(function(t,e){var n=e.isStack,r=e.xPeriod,i=e.utc,o=Kt(t.data(),t.group),a=Object.keys(o).sort((function(e,n){return t.order(e)-t.order(n)})).reduce((function(t,e){return t.concat([o[e]])}),[]),u=t.scaleX.dim,s=t.scaleY.dim,c=t.scaleColor.dim,l=t.scaleSplit.dim,f=function(t){return t[s]>=0?1:-1},d=function(e,n,r){var i,o=[e,t.id(n),r].join(" ");return (i={})[u]=e,i[s]=1e-10*r,i[l]=n[l],i[c]=n[c],i[k]=!0,i[k+"id"]=o,i},h=function(t,e,n){var r=Kt(e,(function(t){return t[u]})),i=e[0];return t.reduce((function(t,e){return t.push.apply(t,r[e]||[d(e,i,n)]),t}),[])},p=function(t,e){return t-e},g=function(){return Jt(a.reduce((function(t,e){return t.concat(e.map((function(t){return t[u]})))}),[])).sort(p)},m=r?function(){var e=g(),n=Math.max.apply(Math,e.map((function(t){return Number(t)}))),o=t.scaleX.domain(),a=x.generate(o[0],o[1],r,{utc:i}).filter((function(t){return t>=o[0]&&t<=o[1]})),u=0,s=[],c=x.get(r,{utc:i});return a.forEach((function(t){var r=Number(t);if(!(r>=n)){for(var i=u;i<e.length;i++)if(Number(c.cast(e[i]))===r)return void u++;s.push(t);}})),e.concat(s).sort(p)}():g(),y=a.map((function(e){return e.sort((function(e,n){return t.xi(e)-t.xi(n)}))})).reduce(n?function(t,e){var n=Kt(e,(function(t){return String(f(t))}));return Object.keys(n).reduce((function(t,e){return t.concat(h(m,n[e],e))}),t)}:function(t,e){Kt(e,(function(t){return String(f(t))}));var n=Math.max.apply(Math,e.map((function(t){return t[u]})));return t.concat(h(m.filter((function(t){return t<=n})),e,0))},[]);return {data:function(){return y},size:function(e){return e[k]?t.scaleSize(0):t.size(e)},id:function(e){return e[k]?e[k+"id"]:t.id(e)}}}));var A=n(5);function T(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return 2===e.length?e[0]*(1-t)+e[1]*t:3===e.length?e[0]*(1-t)*(1-t)+2*e[1]*(1-t)*t+e[2]*t*t:e[0]*(1-t)*(1-t)*(1-t)+3*e[1]*(1-t)*(1-t)*t+3*e[2]*(1-t)*t*t+e[3]*t*t*t}function E(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r=e.map((function(t){return t.x})),i=e.map((function(t){return t.y}));return {x:T.apply(void 0,[t].concat(r)),y:T.apply(void 0,[t].concat(i))}}function C(t,e,n,r,i){var o=E(t,e,n),a=E(t,e,n,r),u=E(t,n,r,i),s=E(t,r,i);return [e,o,a,E(t,a,u),u,s,i]}function N(t,e,n){var r;return void 0===n&&(n="polyline"),function(i){return 0===i?t:1===i?e:(r||(r=("cubic"===n?j:L)(t,e)),r(i))}}function L(t,e){var n=(t=t.filter((function(t){return !t.isInterpolated}))).map((function(t){return t.id})),r=e.map((function(t){return t.id})),i=n.filter((function(t){return r.indexOf(t)>=0})),o=t.filter((function(t){return !t.positionIsBeingChanged})),a=e.filter((function(t){return !t.positionIsBeingChanged})),u=X(o,a),s=X(a,o),c=[];return i.forEach((function(o,a){var l=n.indexOf(o),f=r.indexOf(o);if(0===a&&(l>0||f>0)&&c.push(P({isCubic:!1,polylineFrom:t.slice(0,l+1),polylineTo:e.slice(0,f+1),toOppositeScale:0===f?u:s})),a>0){var d=n.indexOf(i[a-1]),h=r.indexOf(i[a-1]);(l-d>1||f-h>1)&&c.push(F({isCubic:!1,polylineFrom:t.slice(d,l+1),polylineTo:e.slice(h,f+1)}));}c.push(z({pointFrom:t[l],pointTo:e[f]})),a===i.length-1&&(t.length-l-1>0||e.length-f-1>0)&&c.push(P({isCubic:!1,polylineFrom:t.slice(l),polylineTo:e.slice(f),toOppositeScale:e.length-f==1?u:s}));})),0===c.length&&(e.length>0&&0===i.length||t.length>0&&0===i.length)&&c.push(R({isCubic:!1,polylineFrom:t.slice(0),polylineTo:e.slice(0)})),function(t){var e=[];return c.forEach((function(n){var r=n(t);D(e,r);})),e}}function j(t,e){for(var n=2;n<t.length-1;n+=3)t[n-1].isCubicControl=!0,t[n].isCubicControl=!0;for(n=2;n<e.length-1;n+=3)e[n-1].isCubicControl=!0,e[n].isCubicControl=!0;var r,i;for(n=(t=t.filter((function(t){return !t.isInterpolated}))).length-2;n>=0;n--)i=t[n+1],(r=t[n]).isCubicControl||i.isCubicControl||(t.splice(n+1,0,E(1/3,i,r),E(2/3,i,r)),t[n+1].isCubicControl=!0,t[n+2].isCubicControl=!0);var o=t.filter((function(t,e){return e%3==0})),a=e.filter((function(t,e){return e%3==0})),u=o.map((function(t){return t.id})),s=a.map((function(t){return t.id})),c=u.reduce((function(e,n){return e[n]=t.findIndex((function(t){return t.id===n})),e}),{}),l=s.reduce((function(t,n){return t[n]=e.findIndex((function(t){return t.id===n})),t}),{}),f=u.filter((function(t){return s.indexOf(t)>=0})),d=o.filter((function(t){return !t.positionIsBeingChanged})),h=a.filter((function(t){return !t.positionIsBeingChanged})),p=X(d,h),g=X(h,d),m=[];return f.forEach((function(n,r){var i,o,a,u=c[n],s=l[n];if(0===r&&(u>0||s>0)&&m.push(P({polylineFrom:t.slice(0,u+1),polylineTo:e.slice(0,s+1),toOppositeScale:0===s?p:g,isCubic:!0})),r>0){var d=c[f[r-1]],h=l[f[r-1]];u-d>3||s-h>3?m.push(F({polylineFrom:t.slice(d,u+1),polylineTo:e.slice(h,s+1),isCubic:!0})):m.push((i={polylineFrom:t.slice(d,u+1),polylineTo:e.slice(h,s+1)},o=i.polylineFrom,a=i.polylineTo,function(t){return W(o.slice(1,3),a.slice(1,3),t)}));}m.push(z({pointFrom:t[u],pointTo:e[s]})),r===f.length-1&&(t.length-u-1>0||e.length-s-1>0)&&m.push(P({polylineFrom:t.slice(u),polylineTo:e.slice(s),toOppositeScale:e.length-s==1?p:g,isCubic:!0}));})),0===m.length&&(e.length>0&&0===f.length||t.length>0&&0===f.length)&&m.push(R({polylineFrom:t.slice(0),polylineTo:e.slice(0),isCubic:!0})),function(t){var e=[];return m.forEach((function(n){var r=n(t);D(e,r);})),e}}function P(t){var e=t.polylineFrom,n=t.polylineTo,r=t.isCubic,i=t.toOppositeScale,o=e.length>n.length?e:n,a=1===n.length,u=e[0].id!==n[0].id,s=Boolean(u!==a);return function(t){var e=(r?U:H)({t:t,polyline:o,decreasing:a,rightToLeft:s});a===s?e.shift():e.pop();var n=W(e.map(i),e,a?1-t:t);return n.forEach((function(t){return t.positionIsBeingChanged=!0})),n}}function F(t){var e=t.polylineFrom,n=t.polylineTo,r=t.isCubic,i=e.length,o=n.length;if(o!==i){var a=o<i,u=a?e:n,s=(r?q:G)({smallerPolyline:a?n:e,biggerPolyline:u,decreasing:a}),c=u.slice(1,u.length-1),l=s.slice(1,s.length-1);return function(t){var e=W(l,c,a?1-t:t);return e.forEach((function(t){return t.positionIsBeingChanged=!0})),e}}var f=e.slice(1,e.length-1),d=n.slice(1,n.length-1);return function(t){var e=W(f,d,t);return e.forEach((function(t){return t.positionIsBeingChanged=!0})),e}}function z(t){var e=t.pointFrom,n=t.pointTo;return function(t){return [B(e,n,t)]}}function R(t){var e=t.polylineFrom,n=t.polylineTo,r=t.isCubic,i=0===n.length,o=i,a=i?e:n;return function(t){var e=(r?U:H)({t:t,polyline:a,decreasing:i,rightToLeft:o});return e.forEach((function(t,e){e>0&&(t.positionIsBeingChanged=!0);})),e}}function D(t,e){return Array.prototype.push.apply(t,e)}function I(t,e,n){return void 0===e?t:"number"==typeof e?t+n*(e-t):e}function B(t,e,n){if(t===e)return e;var r={};return Object.keys(t).forEach((function(i){return r[i]=I(t[i],e[i],n)})),void 0!==e.id&&(r.id=e.id),r}function W(t,e,n){return t.map((function(t,r){return B(t,e[r],n)}))}function H(t){var e=t.t,n=t.polyline,r=t.decreasing,i=t.rightToLeft,o=Boolean(r)!==Boolean(i),a=function(t,e){var n=0;if(t>0){for(var r,i,o,a,u=[0],s=0,c=1;c<e.length;c++)o=e[c-1].x,a=e[c-1].y,r=e[c].x,i=e[c].y,s+=Math.sqrt((r-o)*(r-o)+(i-a)*(i-a)),u.push(s);var l=t*s;for(c=1;c<u.length;c++)if(l<=u[c]){n=Math.min(1,(c-1+(l-u[c-1])/(u[c]-u[c-1]))/(e.length-1));break}}var f=Math.floor((e.length-1)*n)+1,d=e.length-f,h=f,p=e.slice(0,f);if(n<1){var g=n*(e.length-1)%1,m=B(e[f-1],e[f],g);D(p,Xt(d).map((function(t){return Object.assign({},m,{id:e[h+t].id,isInterpolated:!0})})));}return p}(r?1-e:e,o?n.slice(0).reverse():n);return o&&a.reverse(),a}function U(t){var e=t.t,n=t.polyline,r=t.decreasing,i=t.rightToLeft,o=Boolean(r)!==Boolean(i),a=function(t,e){var n=(e.length-1)/3+1,r=0;if(t>0){for(var i,o,a,u,s,c,l,f,d=[0],h=0,p=1;p<n;p++)a=e[3*p-3].x,u=e[3*p-3].y,s=e[3*p-2].x,c=e[3*p-2].y,l=e[3*p-1].x,f=e[3*p-1].y,i=e[3*p].x,o=e[3*p].y,h+=(Y(a,u,s,c)+Y(s,c,l,f)+Y(l,f,i,o)+Y(i,o,a,u))/2,d.push(h);var g=t*h;for(p=1;p<d.length;p++)if(g<=d[p]){r=Math.min(1,(p-1+(g-d[p-1])/(d[p]-d[p-1]))/(n-1));break}}var m=Math.floor((n-1)*r)+1,y=n-m,v=3*m,b=e.slice(0,3*(m-1)+1);if(r<1){var x=V(r*(n-1)%1,e.slice(3*(m-1),3*m+1)).slice(1,4);x.forEach((function(t){return t.isInterpolated=!0})),x[2].id=e[v].id,D(b,x),Xt(1,y).forEach((function(t){D(b,[{x:x[2].x,y:x[2].y,isCubicControl:!0,isInterpolated:!0},{x:x[2].x,y:x[2].y,isCubicControl:!0,isInterpolated:!0},Object.assign({},x[2],{id:e[v+3*t].id,isInterpolated:!0})]);}));}return b}(r?1-e:e,o?n.slice(0).reverse():n);return o&&a.reverse(),a}function G(t){var e=t.smallerPolyline,n=t.biggerPolyline,r=t.decreasing,i=e.length-1,o=n.length-1,a=Math.floor(o/i)+1,u=o%i,s=Xt(i).map((function(t){return a+Number(t<u)})),c=[e[0]],l=1;return s.forEach((function(t){Xt(1,t).forEach((function(i){var o;i===t-1?(o=Object.assign({},e[l]),r||(o.id=n[c.length].id)):((o=B(e[l-1],e[l],i/(t-1))).id=n[c.length].id,r&&(o.isInterpolated=!0)),c.push(o);})),l++;})),c}function q(t){var e=t.smallerPolyline,n=t.biggerPolyline,r=t.decreasing,i=(e.length-1)/3,o=(n.length-1)/3,a=Math.floor(o/i)+1,u=o%i,s=Xt(i).map((function(t){return a+Number(t<u)})),c=[e[0]],l=3;return s.forEach((function(t){if(t>2){var i=function(t,e){for(var n,r,i=[e[0]],o=0;o<t.length;o++)n=0===o?t[0]:t[o]/(1-t[o-1]),r=V(n,e),D(i,r.slice(1,4)),e=r.slice(3);return D(i,e.slice(1)),i}(Xt(1,t-1).map((function(e){return e/(t-1)})),e.slice(l-3,l+1));Xt(t-2).forEach((function(t){return i[3*(t+1)].id=n[c.length-1+3*t].id})),r&&i.forEach((function(t,e){e>0&&e<i.length-1&&(t.isInterpolated=!0);})),D(c,i.slice(1));}else {var o=Object.assign({},e[l-2]),a=Object.assign({},e[l-1]),u=Object.assign({},e[l]);r||(u.id=n[c.length+2].id),c.push(o,a,u);}l+=3;})),c}function X(t,e){var n,r,i,o,a=[],u=[],s=0,c=t.length,l=e.length;for(n=0;n<c;n++)for(i=t[n],r=s;r<l;r++)if(o=e[r],i.id===o.id){s=r+1,a.push(i),u.push(o);break}if(a.length<1||u.length<1)return function(t){return t};var f=Object.keys(a[0]).filter((function(t){return "number"==typeof a[0][t]})).filter((function(t){return "id"!==t})),d={},h=function(t,e,n,r){return function(i){return r+(i-e)*(r-n)/(e-t)}};return f.forEach((function(t){for(var e,n,r=a[0][t],i=u[0][t],o=a.length-1;o>0;o--)if((e=a[o][t])!==r)return n=u[o][t],void(d[t]=h(r,e,i,n));d[t]=function(t,e){return function(n){return n-t+e}}(r,i);})),function(t){var e=Object.assign({},t);return f.forEach((function(n){e[n]=d[n](t[n]);})),e}}function Y(t,e,n,r){return Math.sqrt((n-t)*(n-t)+(r-e)*(r-e))}function V(t,e){var n=e[0],r=e[1],i=e[2],o=e[3],a=C(t,n,r,i,o);return [a[1],a[2],a[4],a[5]].forEach((function(t){return t.isCubicControl=!0})),Object.keys(o).forEach((function(e){"x"!==e&&"y"!==e&&"id"!==e&&(a[3][e]=I(n[e],o[e],t));})),a}function $(t,e){if(t.length<2)return t.slice(0);if(2===t.length)return [t[0],{x:J(t[0].x,t[1].x,1/3),y:J(t[0].y,t[1].y,1/3)},{x:J(t[0].x,t[1].x,2/3),y:J(t[0].y,t[1].y,2/3)},t[1]];for(var n,r,i,o,a,u,s,c,l,f,d,h,p,g,m=new Array(3*(t.length-1)+1),y=m.length-1,v=0;v<t.length;v++)m[3*v]=t[v],v>0&&(m[3*v-2]=E(1/3,t[v-1],t[v]),m[3*v-1]=E(2/3,t[v-1],t[v]));for(var b=m.slice(0),x=0;x<3;x++){for(m[1]={x:J(m[0].x,m[3].x,1/3),y:J(m[0].y,J(m[3].y,m[2].y,1.5),2/3)},m[y-1]={x:J(m[y].x,m[y-3].x,1/3),y:J(m[y].y,J(m[y-3].y,m[y-2].y,1.5),2/3)},e&&((m[1].y-m[0].y)*(m[3].y-m[2].y)<0&&(m[1]={x:m[1].x,y:m[0].y}),(m[y-1].y-m[y].y)*(m[y-3].y-m[y-2].y)<0&&(m[y-1]={x:m[y-1].x,y:m[y].y})),v=6;v<b.length;v+=3)n=b[v-5],r=b[v-3],i=b[v-1],(r.x-n.x)*(i.x-r.x)*1e12<1?(o=J(n.x,r.x,.5),u=J(r.x,i.x,.5),a=J(n.y,r.y,.5),s=J(r.y,i.y,.5)):(f=(r.x-n.x)/(i.x-n.x),c=(r.x-n.x*(1-f)*(1-f)-i.x*f*f)/(2*(1-f)*f),l=(r.y-n.y*(1-f)*(1-f)-i.y*f*f)/(2*(1-f)*f),o=J(n.x,c,f),u=J(c,i.x,f),a=J(n.y,l,f),s=J(l,i.y,f),e&&(h=r.x-o,p=u-r.x,d=(s-r.y)/p,(r.y-n.y)*(i.y-r.y)<=0?d=0:(r.y>n.y==s>i.y&&(p=J(p*(g=(i.y-r.y)/(s-r.y)),p,1/(1+Math.abs(g))),d=(i.y-r.y)/p),r.y>n.y==a<n.y&&(h=J(h*(g=(r.y-n.y)/(r.y-a)),h,1/(1+Math.abs(g))),d=(r.y-n.y)/h)),o=r.x-h,u=r.x+p,a=r.y-d*h,s=r.y+d*p)),m[v-4]={x:o,y:a},m[v-2]={x:u,y:s};b=m.slice(0);}return b}function J(t,e,n){return t+n*(e-t)}var K={linear:function(t){return t},step:function(t){for(var e,n,r,i,o=[],a=void 0!==t[0].id,u=void 0!==t[0].size,s=1;s<t.length;s++)e=t[s-1],n=t[s],r={x:(e.x+n.x)/2,y:e.y},i={x:(e.x+n.x)/2,y:n.y},a&&(r.id=e.id+"-"+n.id+"-1",i.id=e.id+"-"+n.id+"-2"),u&&(r.size=e.size,i.size=n.size),1===s&&o.push(e),o.push(r,i,n);return o},"step-before":function(t){for(var e,n,r,i=[],o=void 0!==t[0].id,a=void 0!==t[0].size,u=1;u<t.length;u++)e=t[u-1],n=t[u],r={x:e.x,y:n.y},o&&(r.id=e.id+"-"+n.id),a&&(r.size=n.size),1===u&&i.push(e),i.push(r,n);return i},"step-after":function(t){for(var e,n,r,i=[],o=void 0!==t[0].id,a=void 0!==t[0].size,u=1;u<t.length;u++)e=t[u-1],r={x:(n=t[u]).x,y:e.y},o&&(r.id=e.id+"-"+n.id),a&&(r.size=e.size),1===u&&i.push(e),i.push(r,n);return i}},Z={smooth:function(t){return $(t,!1)},"smooth-keep-extremum":function(t){return $(t,!0)}};function Q(t){return K[t]||Z[t]}function tt(t){return void 0!==Z[t]?"cubic":"polyline"}var et=function(){return (et=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},nt=et({},a,A),rt=function(){return ne((function(t){return t.node().getComputedTextLength()}),(function(t){return t.node().textContent.length}))};var it=function(t,e,n){return e>0&&!document.hidden&&((t=t.transition(n).duration(e)).attr=ot),t.onTransitionEnd=function(t){return st(this,t),this},t},ot=function(t,e){var n,r,i=this,o=nt.transition.prototype.attr.apply(this,arguments);if(0===arguments.length)throw new Error("Unexpected `transition().attr()` arguments.");1===arguments.length?r=t:arguments.length>1&&((n={})[t]=e,r=n);var a="__transitionAttrs__",u="__lastTransitions__",s=ut();this.each((function(){var t=this,e={};for(var n in r)"function"==typeof r[n]?e[n]=r[n].apply(this,arguments):e[n]=r[n];this[a]=Object.assign(this[a]||{},e),this[a][u]||Object.defineProperty(this[a],u,{value:{}}),Object.keys(e).forEach((function(e){return t[a][u][e]=s}));}));var c=function(){var t=this;this[a]&&(Object.keys(r).filter((function(e){return t[a][u][e]===s})).forEach((function(e){return delete t[a][e]})),0===Object.keys(this[a]).length&&delete this[a]);};return this.on("interrupt."+s,(function(){return i.each(c)})),this.on("end."+s,(function(){return i.each(c)})),o},at=0,ut=function(){return ++at},st=function(t,e){if(nt.transition.prototype.isPrototypeOf(t)&&!t.empty()){var n=function(){return e.call(null,t)};return t.on("interrupt.d3_on_transition_end",n),t.on("end.d3_on_transition_end",n),t}e.call(null,t);},ct=function(t,e,n,r){var i=r||function(t){return t},o=function(){i(this);};return function(r){var i=r;return e&&(i=i.call(dt(te(e,n)))),i=(i=it(i,t)).call(dt(n)),t>0?i.on("end.d3_animationInterceptor",(function(){return i.each(o)})):i.each(o),i}},lt=function(t,e){var n=t.node();return t.selectAll(e).filter((function(){return this.parentNode===n}))},ft=function(t,e,n,r,i){void 0===i&&(i="linear");var o="__pathPoints__";return function(t){var a=this;this[o]||(this[o]=n.map((function(){return []})));var u=n.map((function(e,n){var u=Jt(t,r).map(e),s=(Q(i)||Q("linear"))(u),c=a[o][n];return {pointsFrom:c,pointsTo:s,interpolate:N(c,s,tt(i))}}));return function(t){if(0===t){var n=u.map((function(t){return t.pointsFrom}));return e.apply(void 0,n)}if(1===t){var r=u.map((function(t){return t.pointsTo}));return a[o]=r,e.apply(void 0,r)}var i=u.map((function(e){return e.interpolate(t)}));return a[o]=i,e.apply(void 0,i)}}},dt=function(t){return function(e){return Object.keys(t).forEach((function(n){return e.attr(n,t[n])})),e}},ht=function(t){return function(e){return Object.keys(t).forEach((function(n){return e.classed(n,t[n])})),e}},pt=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),gt=function(t){function e(e){var n=t.call(this,e)||this;n.config=e,n.config.guide=te(n.config.guide||{},{animationSpeed:0,enableColorToBarPosition:!1}),n.config.guide.size=n.config.guide.size||{};var r=n.config.stack,i=n.config.guide.enableColorToBarPosition,o=[e.flip&&O.get("flip"),r&&O.get("stack"),i&&O.get("positioningByColor")];return n.decorators=(n.config.transformRules||o).concat(e.transformModel||[]),n.adjusters=(n.config.adjustRules||[]).concat(e.adjustScales||[]),n}return pt(e,t),e.prototype.defineGrammarModel=function(t){var e=this,n=this.config;this.regScale("x",t("pos",n.x,[0,n.options.width])).regScale("y",t("pos",n.y,[n.options.height,0])).regScale("y",t("pos",n.y,(function(t){return ["ordinal","period"].indexOf(t.type)>=0?[0,n.options.height]:[n.options.height,0]}))).regScale("size",t("size",n.size,{})).regScale("color",t("color",n.color,{})).regScale("split",t("split",n.split,{})).regScale("label",t("label",n.label,{})).regScale("identity",t("identity",n.identity,{}));var r=this.getScale("x"),i=this.getScale("y"),o=this.getScale("size"),a=this.getScale("label"),u=this.getScale("color"),s=this.getScale("split"),c=this.getScale("identity"),l=i.domain(),f=i.discrete?l[0]:Math.max(0,Math.min.apply(Math,l)),d=i.value(f)+.5*i.stepSize(f),h=u.domain(),p={data:function(){return e.data()},flip:!1,scaleX:r,scaleY:i,scaleSize:o,scaleLabel:a,scaleColor:u,scaleSplit:s,scaleIdentity:c,color:function(t){return u.value(t[u.dim])},label:function(t){return a.value(t[a.dim])},group:function(t){return t[u.dim]+"(@taucharts@)"+t[s.dim]},order:function(t){var e=t.split("(@taucharts@)")[0],n=h.indexOf(e);return n<0?Number.MAX_VALUE:n},size:function(t){return o.value(t[o.dim])},id:function(t){return c.value(t[c.dim],t)},xi:function(t){return r.value(t[r.dim])},yi:function(t){return i.value(t[i.dim])},y0:function(){return d}};return p.data().forEach((function(t){return p.id(t)})),p},e.prototype.getGrammarRules=function(){return this.decorators.filter((function(t){return t}))},e.prototype.getAdjustScalesRules=function(){return (this.adjusters||[]).filter((function(t){return t}))},e.prototype.createScreenModel=function(t){var e=t.flip,n=function(t,e,n){return t?e:n};return {flip:e,id:t.id,x:n(e,t.yi,t.xi),y:n(e,t.xi,t.yi),x0:n(e,t.y0,t.xi),y0:n(e,t.xi,t.y0),size:t.size,group:t.group,order:t.order,label:t.label,color:function(e){return t.scaleColor.toColor(t.color(e))},class:function(e){return t.scaleColor.toClass(t.color(e))},model:t,toFibers:function(){var e=Kt(t.data(),t.group);return Object.keys(e).sort((function(e,n){return t.order(e)-t.order(n)})).reduce((function(t,n){return t.concat([e[n]])}),[])}}},e.prototype.drawFrames=function(){var t=this,e=this.config.options,n=function(e){return function(t,e){var n=Math.pow(10,e);return Math.round(n*t)/n}(t.screenModel.size(e)/2,4)},r=ct,i=function(e,n,i){var o=t.config.guide.animationSpeed,u=e.selectAll("."+n).data((function(t){return [t]}),t.screenModel.id);u.exit().call(r(o,null,{width:0},(function(t){return a.select(t).remove()}))),u.call(r(o,null,i)),u.enter().append("rect").style("stroke-width",0).call(r(o,{width:0},i));},o=this.config.flip,u=o?"y":"x",s=o?"x":"y",c=o?"x0":"y0",l=o?"height":"width",f=o?"width":"height",d=function(e){var r,o,a;i(e,"lvl-top",((r={})[l]=function(t){return n(t)},r[f]=1,r[u]=function(e){return t.screenModel[u](e)-n(e)/2},r[s]=function(e){return t.screenModel[s](e)},r.fill=function(e){return t.screenModel.color(e)},r.class=function(e){return "lvl-top "+t.screenModel.class(e)},r)),i(e,"lvl-btm",((o={})[l]=function(t){return n(t)},o[f]=1,o[u]=function(e){return t.screenModel[u](e)-n(e)/2},o[s]=function(e){return t.screenModel[c](e)},o.fill=function(e){return t.screenModel.color(e)},o.class=function(e){return "lvl-btm "+t.screenModel.class(e)},o)),i(e,"lvl-link",((a={})[l]=.5,a[f]=function(e){return Math.abs(t.screenModel[s](e)-t.screenModel[c](e))},a[u]=function(e){return t.screenModel[u](e)-.25},a[s]=function(e){return Math.min(t.screenModel[s](e),t.screenModel[c](e))},a.fill=function(e){return t.screenModel.color(e)},a.class=function(e){return "lvl-link "+t.screenModel.class(e)},a));},h=function(e){e.attr("class","frame-id-"+t.config.uid).call((function(e){var n=e.selectAll(".generic").data((function(t){return t}),t.screenModel.id);n.exit().remove(),n.call(d),n.enter().append("g").attr("class","generic").call(d);}));},p=Kt(this.data(),t.screenModel.group),g=Object.keys(p).sort((function(e,n){return t.screenModel.order(e)-t.screenModel.order(n)})).reduce((function(t,e){return t.concat([p[e]])}),[]),m=e.container.selectAll(".frame-id-"+t.config.uid).data(g);m.exit().remove(),m.call(h),m.enter().append("g").call(h);},e}(m),mt=function(){return (mt=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},yt=mt({},u,s);function vt(t,e,n,r){var i=r(n(t),t);return (i[e]||[]).forEach((function(t){return vt(t,e,n,r)})),i}function bt(t,e,n,r){void 0===r&&(r=0),e(t,r)&&(t.units||[]).map((function(t){return bt(t,e,n,r+1)})),n(t,r);}var xt=function(){var t=[];function e(t){for(var e in t)this[e]=t[e];}function n(){this.copiedObjects=[];var t=this;this.recursiveDeepCopy=function(e){return t.deepCopy(e)},this.depth=0;}function r(t,e){var r=new n;return e&&(r.maxDepth=e),r.deepCopy(t)}return e.prototype={constructor:e,canCopy:function(t){return !1},create:function(t){},populate:function(t,e,n){}},n.prototype={constructor:n,maxDepth:256,cacheResult:function(t,e){this.copiedObjects.push([t,e]);},getCachedResult:function(t){for(var e=this.copiedObjects,n=e.length,r=0;r<n;r++)if(e[r][0]===t)return e[r][1]},deepCopy:function(e){if(null===e)return null;if("object"!=typeof e)return e;var n=this.getCachedResult(e);if(n)return n;for(var r=0;r<t.length;r++){var i=t[r];if(i.canCopy(e))return this.applyDeepCopier(i,e)}throw new Error("no DeepCopier is able to copy "+e)},applyDeepCopier:function(t,e){var n=t.create(e);if(this.cacheResult(e,n),this.depth++,this.depth>this.maxDepth)throw new Error("Exceeded max recursion depth in deep copy.");return t.populate(this.recursiveDeepCopy,e,n),this.depth--,n}},r.DeepCopier=e,r.deepCopiers=t,r.register=function(n){n instanceof e||(n=new e(n)),t.unshift(n);},r.register({canCopy:function(){return !0},create:function(t){return t instanceof t.constructor?"object"==typeof(e=t.constructor.prototype)?JSON.parse(JSON.stringify(e)):e:{};var e;},populate:function(t,e,n){for(var r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}}),r.register({canCopy:function(t){return t instanceof Array},create:function(t){return new t.constructor},populate:function(t,e,n){for(var r=0;r<e.length;r++)n.push(t(e[r]));return n}}),r.register({canCopy:function(t){return t instanceof Date},create:function(t){return new Date(t)}}),r}(),_t=function(t){return /^(#|rgb\(|rgba\()/.test(t)},wt=/(.)^/,St={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},Mt={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},Ot=/\\|'|\r|\n|\u2028|\u2029/g,kt="(?:"+Object.keys(St).join("|")+")",At=RegExp(kt),Tt=RegExp(kt,"g"),Et={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};function Ct(t){return xt(t)}function Nt(t){return t instanceof Date&&!isNaN(Number(t))}function Lt(t){return null!=t&&"object"==typeof t}function jt(t){var e=parseFloat(Math.min.apply(Math,t).toFixed(15)),n=parseFloat(Math.max.apply(Math,t).toFixed(15));e===n&&(n-=(n>=0?-1:1)*(n||1)/10);for(var r=[e=Math.min(0,e),n=Math.max(0,n)],i=r[1]-r[0],o=Math.pow(10,Math.floor(Math.log(i/10)/Math.LN10)),a=10/i*o,u=[[.15,10],[.35,5],[.75,2],[1,1],[2,1]],s=-1;a>u[++s][0];);o*=u[s][1],r[0]=Math.floor(r[0]/o)*o,r[1]=Math.ceil(r[1]/o)*o;var c=e-r[0],l=r[1]-n,f=o/2;if(e<0){var d=c>=f?-c:0;r[0]=r[0]-d;}if(n>0){var h=l>=f?-l:0;r[1]=r[1]+h;}return [parseFloat(r[0].toFixed(15)),parseFloat(r[1].toFixed(15))]}function Pt(t,e,n){var r=(void 0===n?{utc:!1}:n).utc,i=yt.extent(t),o=i[0],a=i[1],u=+a-+o,s=r?yt.scaleUtc:yt.scaleTime;if(0===u){return o=new Date(o.getTime()-864e5),a=new Date(a.getTime()+864e5),s().domain([o,a]).nice(e).domain()}var c=s().domain([o,a]).nice(e);if(e)return c.domain();var l=s().domain([o,a]).nice(e).domain(),f=l[0],d=l[1],h=c.ticks(),p=h.length-1;return (+o-+f)/(+h[1]-+f)<.5&&(o=f),(+d-+a)/(+d-+h[p-1])<.5&&(a=d),[o,a]}var Ft=0,zt={};function Rt(t){var e=btoa(encodeURIComponent(t)).replace(/=/g,"_");return zt.hasOwnProperty(e)||(zt[e]="H"+ ++Ft),zt[e]}function Dt(t,e,n){var r=0,i=null,o=ne((function(t,e){return Jt(t.map((function(t){return e.reduce((function(e,n){return e.concat(Nt(r=t[n])?r.getTime():r);var r;}),[])})),(function(t){return JSON.stringify(t)})).reduce((function(t,e){var n=e[0];return t[n]=t[n]||0,t[n]+=1,t}),{})}),(function(t,e){var n=i===t?r:++r;return i=t,e.join("")+"-"+n}));return function(r,i,a){var u=a.length,s=n.getSpec(),c=s.sources["/"].data,l=s.unit.units[0].guide||{};l.padding=l.padding||{l:0,r:0,t:0,b:0};var f=0;"x"===t?f=l.padding.l+l.padding.r:"y"===t&&(f=l.padding.t+l.padding.b);var d,h=(i-u*f)/(d=o(c,e),Object.keys(d).reduce((function(t,e){return t+d[e]}),0));return (function(t,e){return o(c,t)[e]}(e,r)*h+f)/i}}function It(t){var e=!0;try{bt(t,(function(t){if(0===t.type.indexOf("COORDS.")&&"COORDS.RECT"!==t.type)throw new Error("Not applicable")}),(function(t){return t}));}catch(t){"Not applicable"===t.message&&(e=!1);}return e}function Bt(t,e,n,r){if(void 0===r&&(r=0),"requestAnimationFrame"===r){var i=!1;return function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];i||(requestAnimationFrame((function(){i=!1;})),n.apply(this,r),i=!0),t.e=e,t.ts=Date.now();}}return function(){for(var i=[],o=0;o<arguments.length;o++)i[o]=arguments[o];var a={e:e,ts:Date.now()},u=t.e&&t.e===a.e?a.ts-t.ts:r;u>=r&&n.apply(this,i),t.e=a.e,t.ts=a.ts;}}function Wt(t,e){var n=t[0],r=t[1],i=(r-n)/(e-1),o=e>=2?Xt(e-2).map((function(t){return n+i*(t+1)})):[];return [n].concat(o,[r])}function Ht(t){return _t(t)?t:""}function Ut(t){return _t(t)?"":t}function Gt(t){return t/180*Math.PI}function qt(t){return Math.abs(t)>=360&&(t%=360),t<0&&(t=360+t),t}function Xt(t,e){1===arguments.length&&(e=t,t=0);for(var n=[],r=t;r<e;r++)n.push(r);return n}function Yt(t,e,n,r){return t+e*(90===n?-1:1)-r>100}function Vt(t,e,n,r){return t+e*(-90===n?-1:1)-r>20}function $t(t){return Array.isArray(t)?[].concat.apply([],t.map((function(t){return $t(t)}))):t}function Jt(t,e){for(var n={},r=[],i=t.length,o=e||function(t){return String(t)},a=0;a<i;++a){var u=t[a],s=o(u);n.hasOwnProperty(s)||(n[s]=!0,r.push(u));}return r}function Kt(t,e){return t.reduce((function(t,n){var r=e(n);return t[r]=t[r]||[],t[r].push(n),t}),{})}function Zt(t,e){return Jt(t.concat(e))}function Qt(t,e){return t.filter((function(t){return -1!==e.indexOf(t)}))}function te(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r=e.length;if(0===r||!t)return t;for(var i=0;i<r;i++)for(var o=e[i],a=Lt(o)?Object.keys(o):[],u=a.length,s=0;s<u;s++){var c=a[s];void 0===t[c]&&(t[c]=o[c]);}return t}function ee(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r=Object.assign({},t);return e.forEach((function(t){delete r[t];})),r}function ne(t,e){var n=function(r){var i=n.cache,o=String(e?e.apply(this,arguments):r);return i.hasOwnProperty(o)||(i[o]=t.apply(this,arguments)),i[o]};return n.cache={},n}function re(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return function(e,n){var r=0;return t.every((function(t){return 0===(r=t(e,n))})),r}}function ie(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r={};return null==t?r:e.reduce((function(e,n){var r=t[n];return r&&(e[n]=r),e}),{})}function oe(t){return t=null==t?"":String(t),At.test(t)?t.replace(Tt,(function(t){return St[t]})):t}function ae(t,e,n){!e&&n&&(e=n),e=te({},e,Et);var r=RegExp([(e.escape||wt).source,(e.interpolate||wt).source,(e.evaluate||wt).source].join("|")+"|$","g"),i=0,o="__p+='";t.replace(r,(function(e,n,r,a,u){return o+=t.slice(i,u).replace(Ot,(function(t){return "\\"+Mt[t]})),i=u+e.length,n?o+="'+\n((__t=("+n+"))==null?'':utils.escape(__t))+\n'":r?o+="'+\n((__t=("+r+"))==null?'':__t)+\n'":a&&(o+="';\n"+a+"\n__p+='"),e})),o+="';\n",e.variable||(o="with(obj||{}){\n"+o+"}\n"),o="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{var a=new Function(e.variable||"obj",o);}catch(t){throw t.source=o,t}var u=function(t){return a.call(this,t)},s=e.variable||"obj";return u.source="function("+s+"){\n"+o+"}",u}function ue(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}var se=["img","input","br","embed","link","meta","area","base","basefont","bgsound","col","command","frame","hr","image","isindex","keygen","menuitem","nextid","param","source","track","wbr","circle","ellipse","line","path","polygon","rect"].reduce((function(t,e){return t[e]=!0,t}),{});function ce(t){var e=2,n=arguments[1];("object"!=typeof arguments[1]||Array.isArray(arguments[1]))&&(e=1,n={});var r=$t(Array.prototype.slice.call(arguments,e)),i=1===r.length&&"<"!==r[0].trim()[0],o=se[t];if(o&&r.length>0)throw new Error('Tag "'+t+'" is void but content is assigned to it');var a="<"+t,u=Object.keys(n).map((function(t){return " "+t+'="'+n[t]+'"'})).join("");u.length>32&&(u=Object.keys(n).map((function(t){return "\n  "+t+'="'+n[t]+'"'})).join(""));var s=i?r[0]:"\n"+r.map((function(t){return String(t).split("\n").map((function(t){return "  "+t})).join("\n")})).join("\n")+"\n",c=o?"/>":">"+s+"</"+t+">";return ""+a+u+c}function le(t){var e=t,n={then:function(t){return e=t(e),n},result:function(){return e}};return n}var fe=[gt];function de(t){return fe.some((function(e){return t instanceof e}))}function he(t){return (t.units||[]).some((function(t){return t.hasOwnProperty("units")}))}var pe=document.createElement("div"),ge=new WeakMap;function me(t,e){var n;return t instanceof Node?n=t:(pe.insertAdjacentHTML("afterbegin",t),n=pe.childNodes[0]),e.appendChild(n),n}function ye(t){if(ge.has(t))return ge.get(t);var e=t.style.overflow;t.style.overflow="scroll";var n={width:t.offsetWidth-t.clientWidth,height:t.offsetHeight-t.clientHeight};return t.style.overflow=e,ge.set(t,n),n}function ve(t,e){var n="horizontal"===(e=e||"both")||"both"===e,r="vertical"===e||"both"===e,i=ye(t),o=r?i.width+"px":"0",a=n?i.height+"px":"0";t.style.overflow="hidden",t.style.padding="0 "+o+" "+a+" 0";var u=t.scrollWidth>t.clientWidth,s=t.scrollHeight>t.clientHeight,c=r&&!s?i.width+"px":"0",l=n&&!u?i.height+"px":"0";return t.style.padding="0 "+c+" "+l+" 0",t.style.overflow="",t.style.overflowX=u?"scroll":"hidden",t.style.overflowY=s?"scroll":"hidden",i}function be(t,e){return window.getComputedStyle(t).getPropertyValue(e)}function xe(t,e){return parseInt(be(t,e)||"0",10)}function _e(t){var e=xe(t,"padding-left"),n=xe(t,"padding-right"),r=xe(t,"padding-bottom"),i=xe(t,"padding-top"),o=xe(t,"border-top-width")+xe(t,"border-left-width")+xe(t,"border-right-width")+xe(t,"border-bottom-width"),a=t.getBoundingClientRect();return {width:a.width-e-n-2*o,height:a.height-r-i-2*o}}function we(t){var e=document.createElement("div");e.style.position="absolute",e.style.visibility="hidden",e.style.width="100px",e.style.height="100px",e.style.border="1px solid green",e.style.top="0",document.body.appendChild(e),e.innerHTML='<svg class="tau-chart__svg">\n                <g class="tau-chart__cell cell">\n                <g class="x axis">\n                <g class="tick"><text></text></g>\n                </g>\n                </g>\n                </svg>';var n=e.querySelector(".x.axis .tick text");n.textContent=t;var r={width:0,height:0},i=n.getBoundingClientRect();r.width=i.right-i.left,r.height=i.bottom-i.top;var o=0!==t.length?r.width/t.length:0;return r.width=r.width+1.5*o,document.body.removeChild(e),r}function Se(t,e){var n=e.fontSize,r=e.fontFamily,i=e.fontWeight,o="string"==typeof n?n:n+"px",a=t.map((function(t){for(var e=0,n=0;e<=t.length-1;e++){n+=Me(t.charAt(e),{fontSize:o,fontFamily:r,fontWeight:i}).width;}return n})).sort((function(t,e){return e-t}))[0],u=t.length,s=parseInt(o);return {width:a,height:s*u+.39*s*u}}var Me=ne((function(t,e){var n=e.fontSize,r=e.fontFamily,i=e.fontWeight,o=document.createElement("div");o.style.position="absolute",o.style.visibility="hidden",o.style.border="0px",o.style.top="0",o.style.fontSize=n,o.style.fontFamily=r,o.style.fontWeight=i,document.body.appendChild(o),o.innerHTML=" "===t?"&nbsp;":t;var a={width:0,height:0},u=o.getBoundingClientRect();return a.width=u.right-u.left,a.height=u.bottom-u.top,document.body.removeChild(o),a}),(function(t,e){return t+"_"+JSON.stringify(e)}));function Oe(t,e){var n={".":function(t,e){return e.classed(t,!0)},"#":function(t,e){return e.attr("id",t)}},r=Object.keys(n).join("");if(e.indexOf(" ")>=0)throw new Error("Selector should not contain whitespaces.");if(r.indexOf(e[0])>=0)throw new Error("Selector must have tag at the beginning.");var i,o=t instanceof Element,u=o?a.select(t):t,s=function(t){return o?t.node():t},c=u.selectAll(e).filter((function(){return this.parentNode===u.node()})).filter((function(t,e){return 0===e}));if(!c.empty())return s(c);for(var l,f=-1,d=null,h=1,p=e.length;h<=p;h++)(h==p||r.indexOf(e[h])>=0)&&(l=e.substring(f+1,h),f<0?i=u.append(l):n[d].call(null,l,i),d=e[h],f=h);return s(i)}function ke(t,e){return Ae(t,e)[0]||null}function Ae(t,e){for(var n=[],r=Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,i=t.firstElementChild;Boolean(i);i=i.nextElementSibling)r.call(i,e)&&n.push(i);return n}function Te(t,e){if(t.childElementCount>0){var n,r,i=Array.prototype.filter.call(t.childNodes,(function(t){return t.nodeType===Node.ELEMENT_NODE})),o=i.slice().sort(e),a=i.reduce((function(t,e,n){return t.set(e,n),t}),new Map),u=o.reduce((function(t,e,i){var u=a.get(e),s=i-u;return s!==r&&(n&&t.push(n),r=s,n={from:u,to:i,elements:[]}),n.elements.push(e),i===o.length-1&&t.push(n),t}),[]),s=u.slice().sort((function(t,e){return t.from-e.from})),c=s.reduce((function(t,e,n){return t.set(e,n),t}),new Map),l=function(t){for(var e,n,r,i=u.map((function(t,e){return {elements:t.elements,from:c.get(t),to:e}})).sort(re((function(t,e){return t.elements.length-e.elements.length}),t?function(t,e){return e.to-t.to}:function(t,e){return t.to-e.to})),o=0;o<i.length;o++){if((n=i[o]).from>n.to)for(e=o+1;e<i.length;e++)(r=i[e]).from>=n.to&&r.from<n.from&&r.from++;if(n.from<n.to)for(e=o+1;e<i.length;e++)(r=i[e]).from>n.from&&r.from<=n.to&&r.from--;}return i.filter((function(t){return t.from!==t.to}))},f=l(!0),d=l(!1),h=f.length<d.length?f:d,p=s.map((function(t){return t.elements}));h.forEach((function(e){var n,r=p.splice(e.from,1)[0],i=p[e.to],o=i?i[0]:null;1===e.elements.length?n=r[0]:(n=document.createDocumentFragment(),r.forEach((function(t){n.appendChild(t);}))),t.insertBefore(n,o),p.splice(e.to,0,r);}));}}function Ee(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=[];return t.filter((function(t){return Boolean(t)})).forEach((function(t){"string"==typeof t?n.push(t):"object"==typeof t&&n.push.apply(n,Object.keys(t).filter((function(e){return Boolean(t[e])})));})),Jt(n).join(" ").trim().replace(/\s{2,}/g," ")}function Ce(t,e){for(var n,r=[],i=2;i<arguments.length;i++)r[i-2]=arguments[i];var o=document.createEvent("MouseEvents"),a=[!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null],u=r.concat(a.slice(r.length));(n=o).initMouseEvent.apply(n,[e].concat(u)),t.dispatchEvent(o);}function Ne(t,e){return "translate("+t+","+e+")"}function Le(t){return "rotate("+t+")"}function je(t){return ["bottom","top"].indexOf(t.toLowerCase())>=0?"h":"v"}function Pe(t){var e={x:0,y:0},n=t.indexOf("translate(");if(n>=0){var r=t.indexOf(")",n+10),i=t.substring(n+10,r).trim().replace(","," ").replace(/\s+/," ").split(" ");e.x=parseFloat(i[0]),i.length>1&&(e.y=parseFloat(i[1]));}return e}function Fe(t,e,n,r,i,o,a,u){var s,c,l,f,d,h;return h=((l=a-i)*(e-o)-(f=u-o)*(t-i))/(-l*(c=r-e)+(s=n-t)*f),(d=(-c*(t-i)+s*(e-o))/(-l*c+s*f))>=0&&d<=1&&h>=0&&h<=1}function ze(t){for(var e,n,r={x:0,y:0},i=t;i&&"SVG"!==i.nodeName.toUpperCase();)(n=i.getAttribute("transform"))&&(e=Pe(n),r.x+=e.x,r.y+=e.y),i=i.parentNode;return r}function Re(t,e,n){var r=t.selectAll(e).filter(n);if(!r.empty()){var i=a.select(r.node().parentNode).selectAll(e).filter((function(t){return !n(t)})).nodes(),o=i[i.length-1];if(o){var u=Array.prototype.indexOf.call(o.parentNode.childNodes,o),s=o.nextSibling;r.each((function(){Array.prototype.indexOf.call(this.parentNode.childNodes,this)>u||this.parentNode.insertBefore(this,s);}));}}}var De=function(t){return Nt(t)?t.getTime():t},Ie={cross:function(t,e,n){var r=t(),i=Jt(r.map((function(t){return t[e]})),De),o=Jt(r.map((function(t){return t[n]})),De),a=0===i.length?[null]:i;return (0===o.length?[null]:o).reduce((function(t,r){return t.concat(a.map((function(t){var i={};return e&&(i[e]=De(t)),n&&(i[n]=De(r)),i})))}),[])},cross_period:function(t,e,n,r,i,o){var a=t(),u=!!o&&o.utcTime,s=Jt(a.map((function(t){return t[e]})),De),c=Jt(a.map((function(t){return t[n]})),De),l=0===s.length?[null]:s,f=0===c.length?[null]:c;return r&&(l=x.generate(Math.min.apply(Math,s),Math.max.apply(Math,s),r,{utc:u})),i&&(f=x.generate(Math.min.apply(Math,c),Math.max.apply(Math,c),i,{utc:u})),f.reduce((function(t,r){return t.concat(l.map((function(t){var i={};return e&&(i[e]=De(t)),n&&(i[n]=De(r)),i})))}),[])},groupBy:function(t,e){return Jt(t().map((function(t){return t[e]})),De).map((function(t){var n;return (n={})[e]=De(t),n}))},none:function(){return [null]}},Be=function(){function t(t,e,n){var r=t.key,i=t.pipe,o=t.source,a=t.units;void 0===n&&(n={}),this.key=r,this.pipe=i||[],this.source=o,this.units=a,this._frame={key:r,source:o,pipe:this.pipe},this._data=e,this._pipeReducer=function(t,e){return n[e.type](t,e.args)};}return t.prototype.hash=function(){return Rt([this._frame.pipe,this._frame.key,this._frame.source].map((function(t){return JSON.stringify(t)})).join(""))},t.prototype.full=function(){return this._data},t.prototype.part=function(t){return void 0===t&&(t=function(t){return t}),this._frame.pipe.map(t).reduce(this._pipeReducer,this._data)},t}(),We=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),He=function(t){var e=this;Object.keys(t).forEach((function(n){return e[n]=t[n]}));},Ue=function(t,e,n){return t.map((function(t){return "string"==typeof t?n.get(t):t})).filter((function(t){return t})).reduce((function(t,e){return n=t,void 0===(r=e(t,{}))&&(r={}),Object.assign(new He(n),r);var n,r;}),e)},Ge=function(t){function e(e,n,r,i){var o=t.call(this)||this;return te(e.scales,{size_null:{type:"size",source:"?"},split_null:{type:"value",source:"?"},label_null:{type:"value",source:"?"},color_null:{type:"color",source:"?"},identity_null:{type:"identity",source:"?"},"size:default":{type:"size",source:"?"},"color:default":{type:"color",source:"?"},"split:default":{type:"value",source:"?"},"label:default":{type:"value",source:"?"},"identity:default":{type:"identity",source:"?"}}),e.settings=e.settings||{},o.config=e,o.sources=e.sources,o.scales=e.scales,o.unitSet=r,o.grammarRules=i,o.scalesHub=n,o.transformations=Object.assign(e.transformations||{},{where:function(t,e){var n=Object.keys(e||{}).map((function(t){return function(n){return (Nt(r=n[t])?r.getTime():r)===e[t];var r;}}));return t.filter((function(t){return n.every((function(e){return e(t)}))}))}}),o}return We(e,t),e.traverseSpec=function(t,e,n,r,i){void 0===r&&(r=null),void 0===i&&(i=null);var o=[],a=function(t,e,n,r,i){o.push((function(){e(t,r,i);})),t.frames&&t.frames.forEach((function(r){(r.units||[]).map((function(i){return a(i,e,n,t,r)}));})),o.push((function(){return n(t,r,i)}));};return a(t.unit,e,n,r,i),o},e.prototype.unfoldStructure=function(){return this.root=this._expandUnitsStructure(this.config.unit),this.config},e.prototype.getDrawScenarioQueue=function(t){var e=this,n=this.grammarRules,r=this._flattenDrawScenario(t,(function(t,r,i){var o=!1===r.expression.inherit?null:i,a=e._createFrameScalesFactoryMethod(o),u=e.unitSet.create(r.type,Object.assign({},r,{options:t.allocateRect(i.key)})),s=new He(u.defineGrammarModel(a)),c=Ue(u.getGrammarRules(),s,n);return Ue(u.getAdjustScalesRules(),c,n),u.node().screenModel=u.createScreenModel(c),u})),i=this._flattenDrawScenario(t,(function(t,r,i){var o=!1===r.expression.inherit?null:i,a=e._createFrameScalesFactoryMethod(o),u=e.unitSet.create(r.type,Object.assign({},r,{options:t.allocateRect(i.key)})),s=new He(u.defineGrammarModel(a)),c=Ue(u.getGrammarRules(),s,n);return u.node().screenModel=u.createScreenModel(c),u.parentUnit=t,u.addInteraction(),u}));return r.concat((function(){Object.keys(e.scales).forEach((function(t){return e.scalesHub.createScaleInfo(e.scales[t]).commit()}));})).concat(i)},e.prototype._flattenDrawScenario=function(t,n){var r={},i=[],o=[t],a=e.traverseSpec({unit:this.root},(function(t,e,a){var u;t.uid=(u=Rt((e?e.uid+"/":"")+JSON.stringify(Object.keys(t).filter((function(e){return "string"==typeof t[e]})).reduce((function(e,n){return e[n]=t[n],e}),{}))+"-"+JSON.stringify(a.pipe)),r.hasOwnProperty(u)?u+="-"+ ++r[u]:r[u]=0,u),t.guide=Ct(t.guide);var s,c=n(o[0],t,a);i.push(c),0===t.type.indexOf("COORDS.")&&(s=c,o.unshift(s));}),(function(t){0===t.type.indexOf("COORDS.")&&o.shift();}),null,this._datify({source:this.root.expression.source,pipe:[]}));return a.push((function(){return i})),a},e.prototype._expandUnitsStructure=function(t,e){var n=this;void 0===e&&(e=[]);var r=this;if(!1===t.expression.operator)t.frames=t.frames.map((function(t){return r._datify(t)}));else {var i=this._parseExpression(t.expression,e,t.guide);t.transformation=t.transformation||[],t.frames=i.exec().map((function(n){var o=(i.inherit?e:[]).concat([{type:"where",args:n}]).concat(t.transformation);return r._datify({key:n,pipe:o,source:i.source,units:t.units?t.units.map((function(t){var e=Ct(t);return e.guide=t.guide,e})):[]})}));}return t.frames.forEach((function(t){return t.units.forEach((function(e){return n._expandUnitsStructure(e,t.pipe)}))})),t},e.prototype._createFrameScalesFactoryMethod=function(t){var e=this;return function(n,r,i){var o=r||n+":default";return e.scalesHub.createScaleInfo(e.scales[o],t).create("function"==typeof i?i(e.scales[o]):i)}},e.prototype._datify=function(t){return new Be(t,this.sources[t.source].data,this.transformations)},e.prototype._parseExpression=function(t,e,n){var r=this,i=t.operator||"none",o=t.source,a=!1!==t.inherit,u=t.params,s={source:o,pipe:a?e:[]},c=function(){return r._datify(s).part()},l=Ie[i];if(!l)throw new Error(i+" operator is not supported");return {source:o,inherit:a,func:l,args:u,exec:function(){return l.apply(void 0,[c].concat(u||[],[n]))}}},e}(h),qe="tau-chart__",Xe=n(10),Ye=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}();Xe.Tooltip.defaults.baseClass="tau-chart__tooltip";var Ve=["top","bottom"];var $e,Je,Ke=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return Ye(e,t),e.prototype._pickPlace=function(t){if(!this.options.auto)return this.options.place;var e,n,r,i,o,a,u,s,c=0|this.options.winBound,l=(e=c,r=window,i=document.documentElement,o=(r.pageYOffset||i.scrollTop)-i.clientTop,a=(r.pageXOffset||i.scrollLeft)-i.clientTop,u=r.innerWidth||i.clientWidth,s=r.innerHeight||i.clientHeight,{top:(n={top:o,right:a+u,bottom:o+s,left:a,width:u,height:s}).top+e,right:n.right-e,bottom:n.bottom-e,left:n.left+e,width:n.width-2*e,height:n.height-2*e}),f=this.options.place.split("-"),d=this.spacing;if(-1!==Ve.indexOf(f[0]))switch(t.top-this.height-d<=l.top?f[0]="bottom":t.bottom+this.height+d>=l.bottom&&(f[0]="top"),f[1]){case "left":t.right-this.width<=l.left&&(f[1]="right");break;case "right":t.left+this.width>=l.right&&(f[1]="left");break;default:t.left+t.width/2+this.width/2>=l.right?f[1]="left":t.right-t.width/2-this.width/2<=l.left&&(f[1]="right");}else switch(t.left-this.width-d<=l.left?f[0]="right":t.right+this.width+d>=l.right&&(f[0]="left"),f[1]){case "top":t.bottom-this.height<=l.top&&(f[1]="bottom");break;case "bottom":t.top+this.height>=l.bottom&&(f[1]="top");break;default:t.top+t.height/2+this.height/2>=l.bottom?f[1]="top":t.bottom-t.height/2-this.height/2<=l.top&&(f[1]="bottom");}return f.join("-")},e}(Xe.Tooltip),Ze=function(){function t(t,e){this.chart=e,this.handlers=new Map,this.plugins=t.map(this.initPlugin,this);}return t.prototype.initPlugin=function(t){var e=this;t.init&&t.init(this.chart);var n=[];this.handlers.set(t,n);var r=function(r,i){n.push(e.chart.on(r,i,t));};return t.destroy&&r("destroy",t.destroy.bind(t)),Object.keys(t).forEach((function(e){if(0===e.indexOf("on")){var n=e.substr(2).toLowerCase();r(n,t[e].bind(t));}})),t},t.prototype.destroyPlugin=function(t){var e=this;t.destroy&&t.destroy(),this.handlers.get(t).forEach((function(n){e.chart.removeHandler(n,t);}));},t.prototype.destroy=function(){var t=this;this.plugins.forEach((function(e){return t.destroyPlugin(e)}));},t}(),Qe={},tn={},en={reg:function(t,e,n){return n?(tn[t]=n,Qe[t]=function(t,e){this.___tauchartsseed___=new e(this.init(t));},Qe[t].prototype=Object.assign({init:function(t){return t},defineGrammarModel:function(t){return this.node().defineGrammarModel(t)},getGrammarRules:function(t){return this.node().getGrammarRules(t)},getAdjustScalesRules:function(t){return this.node().getAdjustScalesRules(t)},createScreenModel:function(t){return this.node().createScreenModel(t)},addInteraction:function(){this.node().addInteraction();},node:function(){return this.___tauchartsseed___},draw:function(){this.node().draw();}},e)):Qe[t]=e,this},get:function(t){if(!Qe.hasOwnProperty(t))throw new w("Unknown unit type: "+t,S.UNKNOWN_UNIT_TYPE);return Qe[t]},create:function(t,e){var n,r=this.get(t);tn[t]?n=new r(e,this.get(tn[t])):n=new r(e);return n}},nn={},rn={},on={reg:function(t,e,n){return void 0===n&&(n=function(t){return t}),nn[t]=e,rn[t]=n,on},get:function(t){return nn[t]},instance:function(t){return void 0===t&&(t={}),{create:function(e,n,r){return new(on.get(e))(n,(0,rn[e])(r,t))}}}},an=function(){function t(t,e,n){this.registry=t,this.sources=e,this.scales=n;}return t.prototype.createScaleInfo=function(t,e){void 0===e&&(e=null);var n=t.dim,r=t.source,i=(this.sources[r].dims[n]||{}).type,o=this.sources[r].data,a=e||new Be({source:r},o);return t.dimType=i,this.registry.create(t.type,a,t)},t.prototype.createScaleInfoByName=function(t,e){return void 0===e&&(e=null),this.createScaleInfo(this.scales[t],e)},t}(),un=function(t,e,n){var r=!0,i=null;try{t.reduce((function(t,r){var o=function(t,e){var n=r[e],i=Lt(n)?JSON.stringify(n):n;return t.push(i),t},a=e.reduce(o,[]).join("/"),u=n.reduce(o,[]).join("/");if(t.hasOwnProperty(a)){var s=t[a];if(s!==u)throw i={type:"RelationIsNotAFunction",keyX:e.join("/"),keyY:n.join("/"),valX:a,errY:[s,u]},new Error("RelationIsNotAFunction")}else t[a]=u;return t}),{});}catch(t){if("RelationIsNotAFunction"!==t.message)throw t;r=!1;}return {result:r,error:i}},sn=function(t,e){var n=Object.keys(t).reduce((function(e,n){var r=t[n];return r.hasOwnProperty("hasNull")&&!r.hasNull||"measure"!==r.type&&"period"!==r.scale||e.push(n),e}),[]);return function(t){var r=!n.some((function(e){return !t.hasOwnProperty(e)||null===t[e]}));return r||e(t),r}},cn=function(t){var e={category:"ordinal",order:"ordinal",measure:"linear"},n={};return Object.keys(t).forEach((function(r){var i=t[r],o=(i.type||"category").toLowerCase();n[r]=Object.assign({},i,{type:o,scale:i.scale||e[o],value:i.value});})),n},ln=function(t){var e={type:"category",scale:"ordinal"};return t.reduce((function(t,n){return Object.keys(n).forEach((function(r){var i=n.hasOwnProperty(r)?n[r]:null;if(t[r]=t[r]||{type:null,hasNull:!1},null===i)t[r].hasNull=!0;else {var o=function(t,e){var n=e;return Nt(t)?(n.type="measure",n.scale="time"):Lt(t)?(n.type="order",n.scale="ordinal"):Number.isFinite(t)&&(n.type="measure",n.scale="linear"),n}(i,Ct(e)),a=o.type,u=o.scale,s=null!==t[r].type&&t[r].type!==a;t[r].type=s?e.type:a,t[r].scale=s?e.scale:u;}})),t}),{})},fn=function(t,e,n){var r=t,i=["period","time"].indexOf(n.scale)>=0?function(t){return new Date(t)}:function(t){return t},o=t.reduce((function(t,e,n){return t.set(e,n),t}),new Map);if("measure"===n.type||"period"===n.scale)r=t.slice().sort(re((function(t,n){return i(t[e])-i(n[e])}),(function(t,e){return o.get(t)-o.get(e)})));else if(n.order){var a=n.order.reduce((function(t,e,n){return t[e]=n,t}),{}),u=n.order.length,s="(___"+e+"___)";r=t.map((function(t){var n=a[t[e]];return n=n>=0?n:u,t[s]=n,t})).sort(re((function(t,e){return t[s]-e[s]}),(function(t,e){return o.get(t)-o.get(e)}))).map((function(t){return delete t[s],t}));}return r},dn=function(t,e){var n=document.createElement("div");return n.classList.add(qe+t),e&&e.appendChild(n),n},hn=function(){function t(t){this.spec=t,this.dist={sources:{"?":{dims:{},data:[{}]},"/":{dims:{},data:[]}},scales:{x_null:{type:"ordinal",source:"?"},y_null:{type:"ordinal",source:"?"},size_null:{type:"size",source:"?"},color_null:{type:"color",source:"?"},split_null:{type:"value",source:"?"},"pos:default":{type:"ordinal",source:"?"},"size:default":{type:"size",source:"?"},"label:default":{type:"value",source:"?"},"color:default":{type:"color",source:"?"},"split:default":{type:"value",source:"?"}},settings:t.settings};}return t.prototype.convert=function(){var t=this.spec,e=this.dist;return this.ruleAssignSourceDims(t,e),this.ruleAssignStructure(t,e),this.ruleAssignSourceData(t,e),this.ruleApplyDefaults(e),e},t.prototype.ruleApplyDefaults=function(t){var e=t.settings||{},n=function(t,e,r){e(t,r),(t.units||[]).map((function(r){return n(r,e,t)}));};n(t.unit,(function(t,n){if(t.namespace="chart",t.guide=te(t.guide||{},{animationSpeed:e.animationSpeed||0,utcTime:e.utcTime||!1}),n&&!t.hasOwnProperty("units")){t=te(t,{x:n.x,y:n.y});var r=Ct(n.guide)||{};t.guide.x=te(t.guide.x||{},r.x),t.guide.y=te(t.guide.y||{},r.y),t.expression.inherit=n.expression.inherit;}return !n||t.guide&&t.guide.hasOwnProperty("obsoleteVerticalStackOrder")||(t.guide=Object.assign(t.guide||{},{obsoleteVerticalStackOrder:(n.guide||{}).obsoleteVerticalStackOrder})),t}),null);},t.prototype.ruleAssignSourceData=function(t,e){var n=t.spec.dimensions||{},r=e.sources["/"].dims,i=function(t,e){var n=t[e];return Lt(n)&&!Nt(n)&&Object.keys(n).forEach((function(r){return t[e+"."+r]=n[r]})),t};e.sources["/"].data=t.data.map((function(t){var e=Object.keys(t).reduce(i,t);return Object.keys(r).reduce((function(t,e){return t.hasOwnProperty(e)||(t[e]=null),null!==t[e]&&n[e]&&["period","time"].indexOf(n[e].scale)>=0&&(t[e]=new Date(t[e])),t}),e)}));},t.prototype.ruleAssignSourceDims=function(t,e){var n=t.spec.dimensions;e.sources["/"].dims=Object.keys(n).reduce((function(t,e){return t[e]={type:n[e].type},t}),{});},t.prototype.ruleAssignStructure=function(t,e){var n=this,r=function(t){var i=Ct(ee(t,"unit"));return n.ruleCreateScales(t,i,e.settings),i.expression=n.ruleInferExpression(t),t.unit&&(i.units=t.unit.map(r)),i},i=r(t.spec.unit);i.expression.inherit=!1,e.unit=i;},t.prototype.ruleCreateScales=function(t,e,n){var r=this,i=t.guide||{};["identity","color","size","label","x","y","split"].forEach((function(o){t.hasOwnProperty(o)&&(e[o]=r.scalesPool(o,t[o],i[o]||{},n));}));},t.prototype.ruleInferDim=function(t,e){var n=t,r=this.spec.spec.dimensions;if(!r.hasOwnProperty(n))return n;e.hasOwnProperty("tickLabel")?n=t+"."+e.tickLabel:r[t].value&&(n=t+"."+r[t].value);var i=this.dist.sources["/"].dims;return i.hasOwnProperty(n)||(i[n]={type:i[t].type},delete i[t]),n},t.prototype.scalesPool=function(t,e,n,r){var i=t+"_"+e;if(this.dist.scales.hasOwnProperty(i))return i;var o=this.spec.spec.dimensions,a={};if("color"===t&&null!==e&&(a={type:"color",source:"/",dim:this.ruleInferDim(e,n)},n.hasOwnProperty("brewer")&&(a.brewer=n.brewer),o[e]&&o[e].hasOwnProperty("order")&&(a.order=o[e].order),n.hasOwnProperty("min")&&(a.min=n.min),n.hasOwnProperty("max")&&(a.max=n.max),n.hasOwnProperty("nice")&&(a.nice=n.nice)),"size"===t&&null!==e&&(a={type:"size",source:"/",dim:this.ruleInferDim(e,n)},n.hasOwnProperty("func")&&(a.func=n.func),n.hasOwnProperty("min")&&(a.min=n.min),n.hasOwnProperty("max")&&(a.max=n.max),n.hasOwnProperty("minSize")&&(a.minSize=n.minSize),n.hasOwnProperty("maxSize")&&(a.maxSize=n.maxSize)),"label"===t&&null!==e&&(a={type:"value",source:"/",dim:this.ruleInferDim(e,n)}),"split"===t&&null!==e&&(a={type:"value",source:"/",dim:this.ruleInferDim(e,n)}),"identity"===t&&null!==e&&(a={type:"identity",source:"/",dim:this.ruleInferDim(e,n)}),o.hasOwnProperty(e)&&("x"===t||"y"===t)){if(a={type:o[e].scale,source:"/",dim:this.ruleInferDim(e,n)},o[e].hasOwnProperty("order")&&(a.order=o[e].order),n.hasOwnProperty("min")&&(a.min=n.min),n.hasOwnProperty("max")&&(a.max=n.max),n.hasOwnProperty("autoScale")?a.autoScale=n.autoScale:a.autoScale=!0,n.hasOwnProperty("nice")?a.nice=n.nice:a.nice=a.autoScale,n.hasOwnProperty("niceInterval")?a.niceInterval=n.niceInterval:a.niceInterval=null,n.hasOwnProperty("tickPeriod")&&(a.period=n.tickPeriod,a.type="period"),n.hasOwnProperty("tickPeriod")&&n.hasOwnProperty("timeInterval"))throw new Error('Use "tickPeriod" for period scale, "timeInterval" for time scale, but not both');if(n.hasOwnProperty("timeInterval")){a.period=n.timeInterval,a.type="time";var u=x.get(a.period,{utc:r.utcTime});n.hasOwnProperty("min")&&(a.min=u.cast(new Date(n.min))),n.hasOwnProperty("max")&&(a.max=u.cast(new Date(n.max)));}a.fitToFrameByDims=n.fitToFrameByDims,a.ratio=n.ratio;}return this.dist.scales[i]=a,i},t.prototype.getScaleConfig=function(t,e){var n=t+"_"+e;return this.dist.scales[n]},t.prototype.ruleInferExpression=function(t){var e={operator:"none",params:[]},n=t.guide||{},r=n.x||{},i=n.y||{},o=this.getScaleConfig("x",t.x),a=this.getScaleConfig("y",t.y);return 0===t.type.indexOf("ELEMENT.")?t.color&&(e={operator:"groupBy",params:[this.ruleInferDim(t.color,n.color||{})]}):"COORDS.RECT"===t.type&&1===t.unit.length&&"COORDS.RECT"===t.unit[0].type&&(e=o.period||a.period?{operator:"cross_period",params:[this.ruleInferDim(t.x,r),this.ruleInferDim(t.y,i),o.period,a.period]}:{operator:"cross",params:[this.ruleInferDim(t.x,r),this.ruleInferDim(t.y,i)]}),Object.assign({inherit:!0,source:"/"},e)},t}(),pn=n(6),gn=n(7),mn=function(){return (mn=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},yn=mn({},pn,gn),vn=yn.format(".4s"),bn=yn.format(".2r"),xn=yn.format(".1e"),_n=($e=/\.0+([^\d].*)?$/,Je=/(\.\d+?)0+([^\d].*)?$/,function(t){return t.replace($e,"$1").replace(Je,"$1$2")}),wn={_identity:function(t,e){return String(null==t?e:t)},"x-num-auto":function(t){if(isNaN(t))return "NaN";var e=Math.abs(t);return _n(e<1?0===e?"0":e<1e-6?xn(t):bn(t):vn(t))},percent:function(t){return parseFloat((100*t).toFixed(2)).toString()+"%"},day:yn.timeFormat("%d-%b-%Y"),"day-utc":yn.utcFormat("%d-%b-%Y"),"day-short":yn.timeFormat("%d-%b"),"day-short-utc":yn.utcFormat("%d-%b"),week:yn.timeFormat("%d-%b-%Y"),"week-utc":yn.utcFormat("%d-%b-%Y"),"week-short":yn.timeFormat("%d-%b"),"week-short-utc":yn.utcFormat("%d-%b"),month:function(t){var e=0===new Date(t).getMonth()?"%B, %Y":"%B";return yn.timeFormat(e)(t)},"month-utc":function(t){var e=0===new Date(t).getUTCMonth()?"%B, %Y":"%B";return yn.utcFormat(e)(t)},"month-short":function(t){var e=0===new Date(t).getMonth()?"%b '%y":"%b";return yn.timeFormat(e)(t)},"month-short-utc":function(t){var e=0===new Date(t).getUTCMonth()?"%b '%y":"%b";return yn.utcFormat(e)(t)},"month-year":yn.timeFormat("%B, %Y"),"month-year-utc":yn.utcFormat("%B, %Y"),quarter:function(t){var e=new Date(t),n=e.getMonth();return "Q"+((n-n%3)/3+1)+" "+e.getFullYear()},"quarter-utc":function(t){var e=new Date(t),n=e.getUTCMonth();return "Q"+((n-n%3)/3+1)+" "+e.getUTCFullYear()},year:yn.timeFormat("%Y"),"year-utc":yn.utcFormat("%Y"),"x-time-auto":null},Sn={get:function(t,e){var n=null;if("function"==typeof t)n=t;else {var r=wn._identity,i=wn.hasOwnProperty(t);n=i?wn[t]:r,i&&(n=wn[t]),!i&&t&&(n=function(e){return (Nt(e)?yn.timeFormat(t):yn.format(t))(e)}),i||t||(n=r);}return null!==n?function(t){return n(t,e||"")}:null},add:function(t,e){wn[t]=e;}},Mn=function(t){return t.reduce((function(t,e){return t+e}),0)};var On=function(t,e){var n=e.guide||{},r={x:["label"],y:["label"],size:["label"],color:["label"],padding:[]};return Object.keys(r).forEach((function(e){var i=r[e];!function(t,e,n,r){var i=t.hasOwnProperty(n)?t[n]:{};i=i||{},r.forEach((function(t){Object.assign(e.guide[n][t],i[t]);}));}(n,t,e,i);})),Object.assign(t.guide,Object.keys(n).reduce((function(t,e){return r.hasOwnProperty(e)||(t[e]=n[e]),t}),{})),t},kn=function(t,e,n){return t[e]=te(t[e]||{},{label:""}),t[e].label=Lt(t[e].label)?t[e].label:{text:t[e].label},t[e].label=te(t[e].label,n||{},{padding:32,rotate:0,textAnchor:"middle",cssClass:"label",dock:null}),t[e]},An=function(t,e,n){return t[e]=te(t[e],n||{},{padding:0,density:30,rotate:0,tickPeriod:null,tickFormat:null,autoScale:!0}),t[e].tickFormat=t[e].tickFormat||t[e].tickPeriod,t[e].nice=t[e].hasOwnProperty("nice")?t[e].nice:t[e].autoScale,t[e]},Tn=function(t){var e=t.units||[],n=!t.hasOwnProperty("units"),r=!e.some((function(t){return t.hasOwnProperty("units")}));return {type:t.type,isLeaf:n,isLeafParent:!n&&r}},En=function(t,e,n,r){if(0===t.length)return {width:0,height:0};if(null===e){var i=n("TauChart Library");return i.width=.625*r,i}t.every((function(t){return "number"==typeof t}))&&(t=s.scaleLinear().domain(t).ticks());var o=t.reduce((function(t,n){var r=e(n).toString().length;return !t.computed||r>t.computed?{value:n,computed:r}:t}),{}).value;return n(e(o))},Cn=function(t,e){var n=t.dimType,r=t.scaleType,i=[n,r,"*"].join(":"),o=[n,r].join(":");return e[i]||e[o]||e[n]||null},Nn=function(t,e,n){return t.hasOwnProperty(e+":"+n)?t[e+":"+n]:t[""+e]},Ln=function(t,e){return ["day","week","month"].indexOf(t)>=0&&(t+="-short"+(e?"-utc":"")),t},jn=function(t,e){var n=t.width,r=t.height,i=Math.abs(Gt(e));return {width:Math.max(Math.cos(i)*n,r),height:Math.max(Math.sin(i)*n,r)}},Pn=function(t,e){void 0===e&&(e="x");var n=qt(t),r="x"===e?[[0,45,"middle"],[45,135,"start"],[135,225,"middle"],[225,315,"end"],[315,360,"middle"]]:[[0,90,"end"],[90,135,"middle"],[135,225,"start"],[225,315,"middle"],[315,360,"end"]],i=r.findIndex((function(t){return n>=t[0]&&n<t[1]}));return r[i][2]},Fn=function(t,e,n){var r=Math.ceil(t.width/e);return {height:Math.min(r,n)*t.height,width:e}};function zn(t,e,n,r,i,o){var a=n.values,u=r.values,s=n.isEmpty||t.x.hideTicks,c=r.isEmpty||t.y.hideTicks,l=En(a,Sn.get(t.x.tickFormat,t.x.tickFormatNullAlias),e.getAxisTickLabelSize,e.xAxisTickLabelLimit),f=En(u,Sn.get(t.y.tickFormat,t.y.tickFormatNullAlias),e.getAxisTickLabelSize,e.yAxisTickLabelLimit),d=l,h=f;l.width>e.xAxisTickLabelLimit&&(t.x.tickFormatWordWrap=!0,t.x.tickFormatWordWrapLines=e.xTickWordWrapLinesLimit,d=Fn(l,e.xAxisTickLabelLimit,e.xTickWordWrapLinesLimit)),f.width>e.yAxisTickLabelLimit&&(t.y.tickFormatWordWrap=!0,t.y.tickFormatWordWrapLines=e.yTickWordWrapLinesLimit,h=Fn(f,e.yAxisTickLabelLimit,e.yTickWordWrapLinesLimit)),o&&(t.y.tickFormatWordWrap=!1,t.y.tickFormatWordWrapLines=1,(h=Fn(f,2*e.yAxisTickLabelLimit,1)).width=20);var p=s?0:1,g=c?0:1,m=t.x.label,y=t.y.label,v=m.text&&!m.hide?1:0,b=y.text&&!y.hide?1:0,x=jn(d,t.x.rotate),_=jn(h,t.y.rotate),w=t.padding&&t.padding.b?t.padding.b:0,S=t.padding&&t.padding.l?t.padding.l:0,M=t.paddingNoTicks&&t.paddingNoTicks.b?t.paddingNoTicks.b:0,O=t.paddingNoTicks&&t.paddingNoTicks.l?t.paddingNoTicks.l:0;i?(m.padding=(-e.xAxisPadding-e.xFontLabelHeight)/2+e.xFontLabelHeight,m.paddingNoTicks=m.padding,y.padding=(-e.yAxisPadding-e.yFontLabelHeight)/2,y.paddingNoTicks=y.padding,v=0,b=0):(m.padding=Mn([p*(e.xTickWidth+x.height),v*(e.distToXAxisLabel+e.xFontLabelHeight)]),m.paddingNoTicks=v*(e.distToXAxisLabel+e.xFontLabelHeight),y.padding=Mn([g*(e.yTickWidth+_.width),b*e.distToYAxisLabel]),y.paddingNoTicks=b*e.distToYAxisLabel),o&&(y.padding=0,y.paddingNoTicks=0);var k=e.xFontLabelDescenderLineHeight;return t.padding=Object.assign(t.padding,{b:t.x.hide?w:Mn([t.x.padding,p*(e.xTickWidth+x.height),v*(e.distToXAxisLabel+e.xFontLabelHeight+k)]),l:t.y.hide?S:Mn([t.y.padding,o?0:g*(e.yTickWidth+_.width),b*(e.distToYAxisLabel+e.yFontLabelHeight)])}),t.paddingNoTicks=Object.assign({},t.paddingNoTicks,{b:t.x.hide?M:Mn([t.x.padding,v*(e.distToXAxisLabel+e.xFontLabelHeight+k)]),l:t.y.hide?O:Mn([t.y.padding,b*(e.distToYAxisLabel+e.yFontLabelHeight)])}),t.x=Object.assign(t.x,{density:x.width+2*Nn(e,"xDensityPadding",n.dimType),tickFontHeight:l.height,$minimalDomain:a.length,$maxTickTextW:d.width,$maxTickTextH:d.height,tickFormatWordWrapLimit:e.xAxisTickLabelLimit}),t.y=Object.assign(t.y,{density:_.height+2*Nn(e,"yDensityPadding",r.dimType),tickFontHeight:f.height,$minimalDomain:u.length,$maxTickTextW:h.width,$maxTickTextH:h.height,tickFormatWordWrapLimit:e.yAxisTickLabelLimit}),t}var Rn=function(t){var e=t.unit,n=t.meta,r=t.settings,i=t.allowXVertical,o=t.allowYVertical,a=t.inlineLabels,u=n.dimension(e.x),s=n.dimension(e.y),c=n.scaleMeta(e.x,e.guide.x),l=n.scaleMeta(e.y,e.guide.y),f=c.isEmpty,d=l.isEmpty;e.guide.x.tickFormat=Ln(e.guide.x.tickFormat||Cn(u,r.defaultFormats),r.utcTime),e.guide.y.tickFormat=Ln(e.guide.y.tickFormat||Cn(s,r.defaultFormats),r.utcTime);var h=!!i&&!("measure"===u.dimType),p=!!o&&!("measure"===s.dimType);if(e.guide.x.padding=f?0:r.xAxisPadding,e.guide.x.paddingNoTicks=e.guide.x.padding,e.guide.y.padding=d?0:r.yAxisPadding,e.guide.y.paddingNoTicks=e.guide.y.padding,e.guide.x.rotate=h?-90:0,e.guide.x.textAnchor=Pn(e.guide.x.rotate,"x"),e.guide.y.rotate=p?-90:0,e.guide.y.textAnchor=Pn(e.guide.y.rotate,"y"),e.guide=zn(e.guide,r,c,l,a,he(e)),a){var g=e.guide.x.label,m=e.guide.y.label;g.cssClass+=" inline",g.dock="right",g.textAnchor="end",m.cssClass+=" inline",m.dock="right",m.textAnchor="end";}return e},Dn={NONE:function(t,e,n){var r=Ct(t);return In(Ct(r.unit),r.unit,(function(t,e){return e.guide.x.tickFontHeight=n.getAxisTickLabelSize("X").height,e.guide.y.tickFontHeight=n.getAxisTickLabelSize("Y").height,e.guide.x.tickFormatWordWrapLimit=n.xAxisTickLabelLimit,e.guide.y.tickFormatWordWrapLimit=n.yAxisTickLabelLimit,e})),r},"BUILD-LABELS":function(t,e){var n=Ct(t),r=[],i=[],o=null,a=null;vt(n.unit,"units",Tn,(function(t,n){if(t.isLeaf)return n;!o&&n.x&&(o=n),!a&&n.y&&(a=n),n.guide=n.guide||{},n.guide.x=n.guide.x||{label:{text:""}},n.guide.y=n.guide.y||{label:{text:""}},n.guide.x.label=Lt(n.guide.x.label)?n.guide.x.label:{text:n.guide.x.label&&n.guide.x.label.text?n.guide.x.label.text:""},n.guide.y.label=Lt(n.guide.y.label)?n.guide.y.label:{text:n.guide.y.label&&n.guide.y.label.text?n.guide.y.label.text:""},n.x&&(n.guide.x.label.text=n.guide.x.label.text||e.dimension(n.x).dimName),n.y&&(n.guide.y.label.text=n.guide.y.label.text||e.dimension(n.y).dimName);var u=n.guide.x.label.text;u&&(r.push(u),n.guide.x.tickFormatNullAlias=n.guide.x.hasOwnProperty("tickFormatNullAlias")?n.guide.x.tickFormatNullAlias:"No "+u,n.guide.x.label.text="",n.guide.x.label._original_text=u);var s=n.guide.y.label.text;return s&&(i.push(s),n.guide.y.tickFormatNullAlias=n.guide.y.hasOwnProperty("tickFormatNullAlias")?n.guide.y.tickFormatNullAlias:"No "+s,n.guide.y.label.text="",n.guide.y.label._original_text=s),n}));return o&&(o.guide.x.label.text=o.guide.x.label.hide?"":r.join(" → ")),a&&(a.guide.y.label.text=a.guide.y.label.hide?"":i.join(" → ")),n},"BUILD-GUIDE":function(t,e,n){var r=Ct(t);return In(Ct(r.unit),r.unit,(function(t,r){if(t.isLeaf)return r;var i=!t.isLeaf&&!t.isLeafParent,o=e.scaleMeta(r.x,r.guide.x),a=e.scaleMeta(r.y,r.guide.y),u=!i&&Boolean(o.dimType)&&"measure"!==o.dimType;return r.guide.x.rotate=r.guide.x.rotate||(u?-90:0),r.guide.x.textAnchor=Pn(r.guide.x.rotate),r.guide.x.tickFormat=r.guide.x.tickFormat||Cn(o,n.defaultFormats),r.guide.y.tickFormat=r.guide.y.tickFormat||Cn(a,n.defaultFormats),r.guide.x.padding=i?0:n.xAxisPadding,r.guide.x.paddingNoTicks=r.guide.x.padding,r.guide.y.padding=i?0:n.yAxisPadding,r.guide.y.paddingNoTicks=r.guide.y.padding,r.guide=zn(r.guide,te({distToXAxisLabel:o.isEmpty?n.xTickWidth:n.distToXAxisLabel,distToYAxisLabel:a.isEmpty?n.yTickWidth:n.distToYAxisLabel},n),o,a,null,he(r)),r.guide.x=Object.assign(r.guide.x,{cssClass:i?r.guide.x.cssClass+" facet-axis":r.guide.x.cssClass,avoidCollisions:!!i||r.guide.x.avoidCollisions}),r.guide.y=Object.assign(r.guide.y,{cssClass:i?r.guide.y.cssClass+" facet-axis":r.guide.y.cssClass,avoidCollisions:!i&&r.guide.y.avoidCollisions}),r.guide=Object.assign(r.guide,{showGridLines:r.guide.hasOwnProperty("showGridLines")?r.guide.showGridLines:t.isLeafParent?"xy":""}),r})),r},"BUILD-COMPACT":function(t,e,n){var r=Ct(t);return In(Ct(r.unit),r.unit,(function(t,r){return t.isLeaf?r:(r.guide.hasOwnProperty("showGridLines")||(r.guide.showGridLines=t.isLeafParent?"xy":""),t.isLeafParent?Rn({unit:r,meta:e,settings:te({xTickWordWrapLinesLimit:1,yTickWordWrapLinesLimit:1},n),allowXVertical:!0,allowYVertical:!1,inlineLabels:!0}):(r.guide.x.cssClass+=" facet-axis compact",r.guide.x.avoidCollisions=!0,r.guide.y.cssClass+=" facet-axis compact",r.guide.y.avoidCollisions=!0,Rn({unit:r,meta:e,settings:te({xAxisPadding:0,yAxisPadding:0,distToXAxisLabel:0,distToYAxisLabel:0,xTickWordWrapLinesLimit:1,yTickWordWrapLinesLimit:1},n),allowXVertical:!1,allowYVertical:!0,inlineLabels:!1})))})),r},AUTO:function(t,e,n){return ["BUILD-LABELS","BUILD-GUIDE"].reduce((function(t,r){return Dn[r](t,e,n)}),t)},COMPACT:function(t,e,n){return ["BUILD-LABELS","BUILD-COMPACT"].reduce((function(t,r){return Dn[r](t,e,n)}),t)}},In=function(t,e,n){var r,i=((r=e).options=r.options||{},r.guide=r.guide||{},r.guide.padding=te(r.guide.padding||{},{l:0,b:0,r:0,t:0}),r.guide.x=kn(r.guide,"x",{textAnchor:"end"}),r.guide.x=An(r.guide,"x",{cssClass:"x axis",scaleOrient:"bottom",textAnchor:"middle"}),r.guide.y=kn(r.guide,"y",{rotate:-90,textAnchor:"end"}),r.guide.y=An(r.guide,"y",{cssClass:"y axis",scaleOrient:"left",textAnchor:"end"}),r.guide.size=kn(r.guide,"size"),r.guide.color=kn(r.guide,"color"),r);i=n(Tn(i),i);var o=ee(i=On(i,t),"units");return (i.units||[]).forEach((function(t){return In(Ct(t),(r=o,(e=t).guide=e.guide||{},e.guide.padding=e.guide.padding||{l:0,t:0,r:0,b:0},e.hasOwnProperty("units")||((e=te(e,r)).guide=te(e.guide,Ct(r.guide)),e.guide.x=te(e.guide.x,Ct(r.guide.x)),e.guide.y=te(e.guide.y,Ct(r.guide.y))),e),n);var e,r;})),i},Bn=function(t,e,n,r){var i={dimension:function(t){var e=n.scales[t],r=n.sources[e.source].dims[e.dim]||{};return {dimName:e.dim,dimType:r.type,scaleType:e.type}},scaleMeta:function(t){var e=r("pos",t).domain(),i=n.scales[t],o=n.sources[i.source].dims[i.dim]||{};return {dimName:i.dim,dimType:o.type,scaleType:i.type,values:e,isEmpty:null==o.type}}},o=(Dn[t]||Dn.NONE)({unit:Ct(n.unit)},i,e);return n.unit=o.unit,n},Wn=function(){function t(t){this.spec=t,this.isApplicable=It(t.unit);}return t.prototype.transform=function(t){var e=this.spec;if(!this.isApplicable)return e;var n=e.settings.size,r=e.settings.specEngine.find((function(t){return n.width<=t.width||n.height<=t.height}));return Bn(r.name,e.settings,e,(function(e,n){return t.getScaleInfo(n||e+":default")}))},t}(),Hn=function(){function t(){}return t.optimizeXAxisLabel=function(t,e){var n=e.xAxisTickLabelLimit,r=function(t){if(!t.guide.x.hide&&!t.guide.x.hideTicks&&0!==t.guide.x.rotate){t.guide.x.rotate=0,t.guide.x.textAnchor="middle";var e=0-Math.min(n,t.guide.x.$maxTickTextW)+t.guide.x.$maxTickTextH;i(t,e);}(t.units||[]).filter((function(t){return "COORDS.RECT"===t.type})).forEach((function(t){return r(t)}));},i=function(e,n){t!==e&&"extract-axes"===e.guide.autoLayout?(t.guide.x.padding+=n,t.guide.padding.b+=n):(e.guide.x.label.padding+=e.guide.x.label.padding>0?n:0,e.guide.padding.b+=e.guide.padding.b>0?n:0);};r(t);},t.hideAxisTicks=function(t,e,n){var r=function(t){var e="x"===n?"b":"l",i=t.guide;if(!i[n].hide&&!i[n].hideTicks){he(t)&&"y"===n||(i[n].hideTicks=!0);var o=i[n].label.text&&!i[n].label.hide;i.padding[e]=i.paddingNoTicks?i.paddingNoTicks[e]:0,i[n].padding=i[n].paddingNoTicks||0,i[n].label.padding=o?i[n].label.paddingNoTicks:0;}(t.units||[]).filter((function(t){return "COORDS.RECT"===t.type})).forEach((function(t){return r(t)}));};r(t);},t.facetsLabelsAtTop=function(t,e){var n=function(t){var e=t.units||[];if(he(t)){var r=t.guide;r.y.facetAxis=!0,r.y.rotate=0,r.y.textAnchor="start",e.forEach((function(t){t.guide.padding.t=20;}));}e.filter((function(t){return "COORDS.RECT"===t.type})).forEach((function(t){return n(t)}));};n(t);},t}(),Un=function(t){return t.$maxTickTextW},Gn=function(t){return 0==t.rotate?t.$maxTickTextW:t.$maxTickTextH},qn=function(t){return t.density},Xn=function(t){var e=[],n=[],r=function(t){if("COORDS.RECT"===t.type&&t.units&&t.units[0]&&"COORDS.RECT"===t.units[0].type){var i=t.x.replace(/^x_/,""),o=t.y.replace(/^y_/,"");"null"!==i&&e.push(i),"null"!==o&&n.push(o),t.units.forEach(r);}};r(t.unit);var i={},o={},a=function(t){"COORDS.RECT"===t.type&&t.frames.forEach((function(t){t.key&&(Object.keys(t.key).forEach((function(r){e.indexOf(r)>=0&&(i.hasOwnProperty(r)||(i[r]=[]),i[r].indexOf(t.key[r])<0&&i[r].push(t.key[r])),n.indexOf(r)>=0&&(o.hasOwnProperty(r)||(o[r]=[]),o[r].indexOf(t.key[r])<0&&o[r].push(t.key[r]));})),t.units&&t.units.forEach(a));}));};return a(t.unit),{xFacetCount:Object.keys(i).reduce((function(t,e){return t*i[e].length}),1),yFacetCount:Object.keys(o).reduce((function(t,e){return t*o[e].length}),1)}},Yn={"entire-view":function(t,e,n,r){var i=n.unit.guide,o=Xn(n),a=o.xFacetCount,u=o.yFacetCount;u>0&&Hn.facetsLabelsAtTop(n.unit,n.settings);var s=i.paddingNoTicks?i.padding.l-i.paddingNoTicks.l:0,c=i.paddingNoTicks?i.padding.b-i.paddingNoTicks.b:0,l=i.paddingNoTicks&&t.height-c<n.settings.minChartHeight||u*n.settings.minFacetHeight+c>t.height||a*n.settings.minFacetWidth+s>t.width,f=i.paddingNoTicks&&t.width-s<n.settings.minChartWidth||u*n.settings.minFacetHeight+c>t.height||a*n.settings.minFacetWidth+s>t.width;l&&Hn.hideAxisTicks(n.unit,n.settings,"x"),f&&Hn.hideAxisTicks(n.unit,n.settings,"y");var d=t.width;if(e("x",n.unit,Un)<=t.width)r(n.unit,n.settings);else {var h=e("x",n.unit,Gn);if(h>t.width){var p=Math.max(t.width,e("x",n.unit,qn));d=Math.min(h,p);}}var g=Math.max(t.height,e("y",n.unit,qn));return !l&&d>t.width&&Hn.hideAxisTicks(n.unit,n.settings,"x"),!f&&g>t.height&&Hn.hideAxisTicks(n.unit,n.settings,"y"),{newW:t.width,newH:t.height}},minimal:function(t,e,n){return {newW:e("x",n.unit,qn),newH:e("y",n.unit,qn)}},normal:function(t,e,n,r){Xn(n).yFacetCount>0&&Hn.facetsLabelsAtTop(n.unit,n.settings);var i=n.unit.guide;i.paddingNoTicks&&(t.width-i.padding.l+i.paddingNoTicks.l<n.settings.minChartWidth&&Hn.hideAxisTicks(n.unit,n.settings,"y"),t.height-i.padding.b+i.paddingNoTicks.b<n.settings.minChartHeight&&Hn.hideAxisTicks(n.unit,n.settings,"x"));var o=t.width;if(e("x",n.unit,Un)<=t.width)r(n.unit,n.settings);else {var a=e("x",n.unit,Gn);if(a>t.width){var u=Math.max(t.width,e("x",n.unit,qn));o=Math.min(a,u);}}return {newW:o,newH:Math.max(t.height,e("y",n.unit,qn))}},"fit-width":function(t,e,n,r){var i=n.unit.guide,o=i.paddingNoTicks?i.padding.l-i.paddingNoTicks.l:0;return (i.paddingNoTicks&&t.width-o<n.settings.minChartWidth||Xn(n).xFacetCount*n.settings.minFacetWidth+o>t.width)&&Hn.hideAxisTicks(n.unit,n.settings,"y"),e("x",n.unit,Un)<=t.width&&r(n.unit,n.settings),{newW:t.width,newH:e("y",n.unit,qn)}},"fit-height":function(t,e,n){var r=n.unit.guide,i=r.paddingNoTicks?r.padding.b-r.paddingNoTicks.b:0;return (r.paddingNoTicks&&t.height-i<n.settings.minChartHeight||Xn(n).yFacetCount*n.settings.minFacetHeight+i>t.height)&&Hn.hideAxisTicks(n.unit,n.settings,"x"),{newW:e("x",n.unit,qn),newH:t.height}}},Vn=function(){function t(t){this.spec=t,this.isApplicable=It(t.unit);}return t.prototype.transform=function(t){var e=this.spec;if(!this.isApplicable)return e;var n=e.settings.fitModel;if(!n)return e;var r=e.scales,i=function(t,e){return t.discrete?e*t.domain().length:4*e},o=function(e,n,a,u){void 0===u&&(u=null);var s="x"===e?n.x:n.y,c="x"===e?n.y:n.x,l=n.guide,f=a("x"===e?l.x:l.y),d=n.units[0],h="x"===e?l.padding.l+l.padding.r:l.padding.b+l.padding.t;if("ELEMENT.INTERVAL"===d.type&&"y"===e===Boolean(d.flip)&&d.label&&!t.getScaleInfo(d.label,u).isEmpty()){var p,g=2*(l.label&&l.label.fontSize?l.label.fontSize:10),m=t.getScaleInfo(s,u);if(m.discrete&&(null==d.guide.enableColorToBarPosition?!d.stack:d.guide.enableColorToBarPosition)){var y=d.color;if(y){var v=t.getScaleInfo(y,u);if(v.discrete){v.domain();p=v;}}}var b=n.frames.reduce((function(t,e){return t+function(t){var e=t.part(),n=Jt(e.map((function(t){return t[m.dim]}))).length,r=1;if(p){var i=e.reduce((function(t,e){var n=e[m.dim],r=e[p.dim];return t[n]=t[n]||{},t[n][r]||(t[n][r]=!0),t}),{}),o=Object.keys(i).map((function(t){return Object.keys(i[t]).length}));r=Math.max.apply(Math,o);}return n*r*g}(e)}),0),x=i(m,f);return h+Math.max(b,x)}if("COORDS.RECT"!==d.type){var _=t.getScaleInfo(s,u);return h+i(_,f)}var w,S,M=(w=n.frames,S=r[c].dim,w.reduce((function(t,e){var n=(e.key||{})[S];return t[n]=t[n]||[],t[n].push(e),t}),{})),O=Object.keys(M).map((function(t){return M[t].map((function(t){return o(e,t.units[0],a,t)})).reduce((function(t,e){return t+e}),0)}));return h+Math.max.apply(Math,O)},a=e.settings.size,u=a.width,s=a.height,c=Yn[n];if(c){var l=c(a,o,e,Hn.optimizeXAxisLabel);u=l.newW,s=l.newH;}return e.settings.size=function(n,r,i){var o=e.settings.getScrollbarSize(t.getLayout().contentContainer),a=r.width>n.width&&r.width<=n.width*i?n.width:r.width,u=r.height>n.height&&r.height<=n.height*i?n.height:r.height,s=n.width-a,c=n.height-u>=0?0:o.width;return {height:u-(s>=0?0:o.height),width:a-c}}(a,{width:u,height:s},e.settings.avoidScrollAtRatio),e},t}(),$n=function(){function t(t){this.spec=t,this.isApplicable=t.settings.autoRatio&&It(t.unit);}return t.prototype.transform=function(t){var e=this.spec;if(!this.isApplicable)return e;try{this.ruleApplyRatio(e,t);}catch(t){if("Not applicable"!==t.message)throw t}return e},t.prototype.ruleApplyRatio=function(t,e){var n=function(t){return "COORDS.RECT"===t.type||"RECT"===t.type},r=function(t,e,n,i){void 0===i&&(i=0),e(t,i)&&(t.units||[]).map((function(t){return r(t,e,n,i+1)})),n(t,i);},i=[],o=[];r(t.unit,(function(t,e){if(e>1||!n(t))throw new Error("Not applicable");return i.push(t.x),o.push(t.y),1===(t.units||[]).map((function(t){if(!n(t)&&!function(t){return 0===t.type.indexOf("ELEMENT.")}(t))throw new Error("Not applicable");return t})).filter(n).length}),(function(){return 0}));var a=function(e){return t.scales[e]},u=function(t){return "/"===t.source&&!t.ratio&&!t.fitToFrameByDims},s=function(t){return "ordinal"===t.type||"period"===t.type&&!t.period},c=i.map(a).filter(u),l=o.map(a).filter(u);if([c.length,l.length].some((function(t){return 2===t}))){var f=function(t){return t.dim},d=function(t,e,n){t.fitToFrameByDims=n.slice(0,e).map(f);},h=function(t,n){2===n.filter(s).length&&(n.forEach(d),n[0].ratio=Dt(t,n.map(f),e));};h("x",c),h("y",l);}},t}(),Jn=function(){function t(t){this.spec=t,this.isApplicable="EXTRACT"===t.settings.layoutEngine&&It(t.unit);}return t.prototype.transform=function(){var t=this.spec;if(!this.isApplicable)return t;try{this.ruleExtractAxes(t);}catch(t){if("Not applicable"!==t.message)throw t;console.log("[TauCharts]: can't extract axes for the given chart specification");}return t},t.prototype.ruleExtractAxes=function(t){var e=function(t){return "COORDS.RECT"===t.type||"RECT"===t.type},n=function(t){return t?10:0},r={l:0,r:10,t:10,b:0},i={l:0,b:0},o=[],a=[];bt(t.unit,(function(t,n){if(n>1||!e(t))throw new Error("Not applicable");t.guide=t.guide||{};var u=t.guide,s=u.padding||{l:0,r:0,t:0,b:0},c=u.paddingNoTicks||{l:0,b:0};return r.l+=s.l,r.r+=s.r,r.t+=s.t,r.b+=s.b,i.l+=c.l,i.b+=c.b,o.push(Object.assign({},r)),a.push(Object.assign({},i)),1===(t.units||[]).map((function(t){if(!e(t)&&!function(t){return 0===t.type.indexOf("ELEMENT.")}(t))throw new Error("Not applicable");return t})).filter(e).length}),(function(t){var e=o.pop(),u=a.pop(),s=t.guide||{};s.x=s.x||{},s.x.padding=s.x.padding||0,s.x.paddingNoTicks=s.x.paddingNoTicks||0,s.y=s.y||{},s.y.padding=s.y.padding||0,s.y.paddingNoTicks=s.y.paddingNoTicks||0,s.padding={l:n(t.y),r:n(1),t:n(1),b:n(t.x)},s.paddingNoTicks={l:0,b:0},s.autoLayout="extract-axes",s.x.padding+=r.b-e.b,s.y.padding+=r.l-e.l,s.x.paddingNoTicks+=i.b-u.b,s.y.paddingNoTicks+=i.l-u.l;})),t.unit.guide.padding=r,t.unit.guide.paddingNoTicks=i;},t}(),Kn=function(){function t(t){var e=this,n=void 0===t?{}:t,r=n.src,i=void 0===r?null:r,o=n.timeout,a=void 0===o?Number.MAX_SAFE_INTEGER:o,u=n.syncInterval,s=void 0===u?Number.MAX_SAFE_INTEGER:u,c=n.callbacks,l=void 0===c?{}:c;this.setTimeoutDuration(a),this.setSyncInterval(s),this.setCallbacks(l),this._running=!1,this._queue=[],this._result=i,this._syncDuration=0,this._asyncDuration=0,this._requestedFrameId=null,this._visibilityChangeHandler=function(){if(e._running&&e._requestedFrameId){var t=e._getCancelFrameFunction(),n=e._getRequestFrameFunction();t(e._requestedFrameId),e._requestedFrameId=n(e._requestedFrameCallback);}},this._tasksCount=0,this._finishedTasksCount=0;}return t.prototype.setTimeoutDuration=function(e){t.checkType(e,"number","timeout"),this._timeout=e;},t.prototype.setSyncInterval=function(e){t.checkType(e,"number","syncInterval"),this._syncInterval=e;},t.prototype.setCallbacks=function(e){t.checkType(e,"object","callbacks"),this._callbacks=Object.assign(this._callbacks||{},e);},t.prototype.addTask=function(t){return this._queue.push(t),this._tasksCount++,this},t.prototype.run=function(){if(this._running)throw new Error("Task Runner is already running");this._running=!0,t.runnersInProgress++,document.addEventListener("visibilitychange",this._visibilityChangeHandler),this._loopTasks();},t.prototype.isRunning=function(){return this._running},t.prototype._loopTasks=function(){for(var e,n,r,i,o=0,a=this._syncInterval/t.runnersInProgress;this._running&&!(r=this._asyncDuration>this._timeout)&&!(i=o>a)&&(e=this._queue.shift());){if(null===(n=this._runTask(e)))return;this._syncDuration+=n,this._asyncDuration+=n,o+=n;}r&&this._queue.length>0&&(this.stop(),this._callbacks.timeout&&this._callbacks.timeout.call(null,this._asyncDuration,this)),!r&&i&&this._queue.length>0&&this._requestFrame(),0===this._queue.length&&(this.stop(),this._callbacks.done&&this._callbacks.done.call(null,this._result,this));},t.prototype._runTask=function(t){var e=performance.now();if(this._callbacks.error)try{this._result=t.call(null,this._result,this);}catch(t){return this.stop(),this._callbacks.error.call(null,t,this),null}else this._result=t.call(null,this._result,this);var n=performance.now()-e;return this._finishedTasksCount++,this._callbacks.progress&&this._callbacks.progress.call(null,this._finishedTasksCount/this._tasksCount,this),n},t.prototype._requestFrame=function(){var t=this,e=performance.now(),n=function(){t._requestedFrameId=null;var n=performance.now();t._asyncDuration+=n-e,t._loopTasks();},r=this._getRequestFrameFunction();this._requestedFrameCallback=n,this._requestedFrameId=r(n);},t.prototype._getRequestFrameFunction=function(){var t=this;return document.hidden?function(e){return t._requestedFrameType="idle",window.requestIdleCallback(e,{timeout:17})}:function(e){return t._requestedFrameType="animation",requestAnimationFrame(e)}},t.prototype._getCancelFrameFunction=function(){switch(this._requestedFrameType){case "animation":return function(t){return cancelAnimationFrame(t)};case "idle":return function(t){return window.cancelIdleCallback(t)}}},t.prototype.stop=function(){if(!this._running)throw new Error("Task Runner is already stopped");(this._running=!1,t.runnersInProgress--,document.removeEventListener("visibilitychange",this._visibilityChangeHandler),this._requestedFrameId)&&(this._getCancelFrameFunction()(this._requestedFrameId),this._requestedFrameId=null);},t.checkType=function(t,e,n){if(typeof t!==e)throw new Error('Task Runner "'+n+'" property is not "'+e+'"')},t}();Kn.runnersInProgress=0;var Zn=Kn,Qn=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),tr=function(){return (tr=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},er=tr({},a),nr=Oe,rr=ke,ir=function(t){function e(e){var n,r,i,o,a,u,s,c=t.call(this)||this;return c._nodes=[],c._svg=null,c._filtersStore={filters:{},tick:0},c._layout=(n=dn("layout"),r=dn("layout__header",n),i=dn("layout__container",n),o=dn("layout__sidebar",i),a=dn("layout__content",i),u=dn("layout__content__wrap",a),s=dn("layout__sidebar-right",i),{layout:n,header:r,content:u,contentContainer:a,leftSidebar:o,rightSidebar:dn("layout__sidebar-right__wrap",s),rightSidebarContainer:s,footer:dn("layout__footer",n)}),c.transformers=[$n,Wn],c.onUnitsStructureExpandedTransformers=[Jn,Vn],c._chartDataModel=function(t){return t},c._reportProgress=null,c._taskRunner=null,c._renderingPhase=null,c.applyConfig(e),c}return Qn(e,t),e.prototype.on=function(e,n,r){return t.prototype.on.call(this,e,n,r)},e.prototype.updateConfig=function(t){this.applyConfig(t),this.refresh();},e.prototype.applyConfig=function(t){this._filtersStore.filters={},t=this.setupConfigSettings(t),this.configGPL=this.createGPLConfig(t),this._originData=Object.assign({},this.configGPL.sources),this._liveSpec=this.configGPL,this._emptyContainer=t.emptyContainer||"",this.setupPlugins(t);},e.prototype.createGPLConfig=function(t){var n;return this.isGPLConfig(t)?n=t:(t=this.setupConfig(t),n=new hn(t).convert()),n=e.setupPeriodData(n)},e.prototype.isGPLConfig=function(t){return 2===["sources","scales"].filter((function(e){return t.hasOwnProperty(e)})).length},e.prototype.setupPlugins=function(t){var e=t.plugins||[];this._plugins&&this._plugins.destroy(),this._plugins=new Ze(e,this);},e.prototype.setupConfigSettings=function(t){var n;return this._dataRefs=this._dataRefs||(n=0,{references:new WeakMap,refCounter:function(){return ++n}}),t.settings=e.setupSettings(te(t.settings||{},this._dataRefs)),t},e.prototype.destroy=function(){this.destroyNodes(),er.select(this._svg).remove(),er.select(this._layout.layout).remove(),this._cancelRendering(),t.prototype.destroy.call(this);},e.prototype.setupChartSourceModel=function(t){this._chartDataModel=t;},e.prototype.setupConfig=function(t){if(!t.spec||!t.spec.unit)throw new Error("Provide spec for plot");var n=te(t,{spec:{},data:[],plugins:[],settings:{}});n.spec.dimensions=e.setupMetaInfo(n.spec.dimensions,n.data);var r=n.settings.log;return n.settings.excludeNull&&this.addFilter({tag:"default",src:"/",predicate:sn(n.spec.dimensions,(function(t){return r([t,"point was excluded, because it has undefined values."],"WARN")}))}),n},e.setupPeriodData=function(t){var n=e.__api__.tickPeriod,r=t.settings.log;return Object.keys(t.scales).map((function(e){return t.scales[e]})).filter((function(t){return "period"===t.type})).forEach((function(e){n.get(e.period,{utc:t.settings.utcTime})||(r(['Unknown period "'+e.period+'".',"Docs: https://api.taucharts.com/plugins/customticks.html#how-to-add-custom-tick-period"],"WARN"),e.period=null);})),t},e.setupMetaInfo=function(t,e){var n=t||ln(e);return cn(n)},e.setupSettings=function(t){var n=e.globalSettings,r=te(t||{},Object.keys(n).reduce((function(t,e){return t[e]="function"==typeof n[e]?n[e]:Ct(n[e]),t}),{}));return Array.isArray(r.specEngine)||(r.specEngine=[{width:Number.MAX_VALUE,name:r.specEngine}]),r},e.prototype.insertToLeftSidebar=function(t){return me(t,this._layout.leftSidebar)},e.prototype.insertToRightSidebar=function(t){return me(t,this._layout.rightSidebar)},e.prototype.insertToFooter=function(t){return me(t,this._layout.footer)},e.prototype.insertToHeader=function(t){return me(t,this._layout.header)},e.prototype.addBalloon=function(t){return new Ke("",t||{})},e.prototype.destroyNodes=function(){this._nodes.forEach((function(t){return t.destroy()})),this._nodes=[],this._renderedItems=[];},e.prototype.onUnitDraw=function(t){var e=this;this._nodes.push(t),this.fire("unitdraw",t),["click","mouseover","mouseout"].forEach((function(n){return t.on(n,(function(t,r){e.fire("element"+n,{element:t,data:r.data,event:r.event});}))}));},e.prototype.onUnitsStructureExpanded=function(t){var e=this;this.onUnitsStructureExpandedTransformers.forEach((function(n){return new n(t).transform(e)})),this.fire("unitsstructureexpanded",t);},e.prototype._getClosestElementPerUnit=function(t,e){return this._renderedItems.filter((function(t){return t.getClosestElement})).map((function(n){var r=n.getClosestElement(t,e);return {unit:n.node(),closest:r}}))},e.prototype.disablePointerEvents=function(){this._layout.layout.style.pointerEvents="none";},e.prototype.enablePointerEvents=function(){this._layout.layout.style.pointerEvents="";},e.prototype._handlePointerEvent=function(t){var e=this._svg.getBoundingClientRect(),n=t.clientX-e.left,r=t.clientY-e.top,i="click"===t.type?"data-click":"data-hover",o=null,a=null,u=null,s=this._getClosestElementPerUnit(n,r),c=s.filter((function(t){return t.closest})).sort((function(t,e){return t.closest.distance===e.closest.distance?t.closest.secondaryDistance-e.closest.secondaryDistance:t.closest.distance-e.closest.distance}));if(c.length>0){var l=c.findIndex((function(t){return t.closest.distance!==c[0].closest.distance||t.closest.secondaryDistance!==c[0].closest.secondaryDistance})),f=l<0?c:c.slice(0,l);if(1===f.length)o=f[0].closest.data,a=f[0].closest.node,u=f[0].unit;else {var d=f.reduce((function(t,e){return t+e.closest.x}),0)/f.length,h=f.reduce((function(t,e){return t+e.closest.y}),0)/f.length,p=Math.atan2(h-r,d-n)+Math.PI,g=Math.round((f.length-1)*p/2/Math.PI),m=f[g].closest;o=m.data,a=m.node,u=f[g].unit;}}s.forEach((function(e){return e.unit.fire(i,{event:t,data:o,node:a,unit:u})}));},e.prototype._initPointerEvents=function(){var t=this;this._liveSpec.settings.syncPointerEvents||(this._pointerAnimationFrameId=null);var e=er.select(this._svg),n=this._liveSpec.settings.syncPointerEvents?function(t){return function(){return t(a.event)}}:function(e){return function(){var n=a.event;t._pointerAnimationFrameId&&"mousemove"!==n.type&&t._cancelPointerAnimationFrame(),t._pointerAnimationFrameId||(t._pointerAnimationFrameId=requestAnimationFrame((function(){t._pointerAnimationFrameId=null,e(n);})));}},r=function(e){return t._handlePointerEvent(e)};e.on("mousemove",n(r)),e.on("click",n(r)),e.on("mouseleave",n((function(e){"none"!==window.getComputedStyle(t._svg).pointerEvents&&t.select((function(){return !0})).forEach((function(t){return t.fire("data-hover",{event:e,data:null,node:null,unit:null})}));})));},e.prototype._cancelPointerAnimationFrame=function(){cancelAnimationFrame(this._pointerAnimationFrameId),this._pointerAnimationFrameId=null;},e.prototype._setupTaskRunner=function(t){var e=this;return this._resetTaskRunner(),this._taskRunner=new Zn({timeout:t.settings.renderingTimeout||Number.MAX_SAFE_INTEGER,syncInterval:t.settings.asyncRendering?t.settings.syncRenderingInterval:Number.MAX_SAFE_INTEGER,callbacks:{done:function(){e._completeRendering(),e._renderingPhase=null;},timeout:function(t,n){e._displayTimeoutWarning({timeout:t,proceed:function(){e.disablePointerEvents(),n.setTimeoutDuration(Number.MAX_SAFE_INTEGER),n.run();},cancel:function(){e._cancelRendering();}}),e.enablePointerEvents(),e.fire("renderingtimeout",t);},progress:function(t){var n={spec:0,draw:1}[e._renderingPhase]/2+t/2;e._reportProgress(n);},error:t.settings.handleRenderingErrors?function(n){e._cancelRendering(),e._displayRenderingError(n),e.fire("renderingerror",n),t.settings.log(["An error occured during chart rendering.",'Set "handleRenderingErrors: false" in chart settings to debug.',"Error message: "+n.message].join(" "),"ERROR");}:null}}),this._taskRunner},e.prototype._resetTaskRunner=function(){this._taskRunner&&this._taskRunner.isRunning()&&(this._taskRunner.stop(),this._taskRunner=null);},e.prototype.renderTo=function(t,e){this._resetProgressLayout(),this.disablePointerEvents(),this._insertLayout(t,e);var n=this._createLiveSpec();if(!n)return this._svg=null,this._layout.content.innerHTML=this._emptyContainer,void this.enablePointerEvents();var r=this._createGPL(n),i=this._setupTaskRunner(n);this._scheduleDrawScenario(i,r),this._scheduleDrawing(i,r),i.run();},e.prototype._insertLayout=function(t,e){this._target=t,this._defaultSize=Object.assign({},e);var n=er.select(t).node();if(null===n)throw new Error("Target element not found");this._layout.layout.parentNode!==n&&n.appendChild(this._layout.layout);var r=this._layout.content,i=ye(this._layout.contentContainer);this._layout.contentContainer.style.padding="0 "+i.width+"px "+i.height+"px 0",ve(this._layout.rightSidebarContainer,"vertical");var o=Object.assign({},e)||{};if(!o.width||!o.height){var a=r.parentElement,u=a.scrollLeft,s=a.scrollTop;r.style.display="none",o=te(o,_e(r.parentNode)),r.style.display="",r.parentElement.scrollLeft=u,r.parentElement.scrollTop=s,o.height||(o.height=_e(this._layout.layout).height);}this.configGPL.settings.size=o;},e.prototype._createLiveSpec=function(){var t=this;return this._liveSpec=Ct(ee(this.configGPL,"plugins")),this._liveSpec.sources=this.getDataSources(),this._liveSpec.settings=this.configGPL.settings,this._experimentalSetupAnimationSpeed(this._liveSpec),this.isEmptySources(this._liveSpec.sources)?null:(this._liveSpec=this.transformers.reduce((function(e,n){return new n(e).transform(t)}),this._liveSpec),this.destroyNodes(),this.fire("specready",this._liveSpec),this._liveSpec)},e.prototype._experimentalSetupAnimationSpeed=function(t){t.settings.initialAnimationSpeed=t.settings.initialAnimationSpeed||t.settings.animationSpeed;var e=t.settings.experimentalShouldAnimate(t)?t.settings.initialAnimationSpeed:0;t.settings.animationSpeed=e;var n=function(t){t.guide=t.guide||{},t.guide.animationSpeed=e,t.units&&t.units.forEach(n);};n(t.unit);},e.prototype._createGPL=function(t){var e=new Ge(t,this.getScaleFactory(),en,O),n=e.unfoldStructure();return this.onUnitsStructureExpanded(n),e},e.prototype._scheduleDrawScenario=function(t,e){var n=this,r=er.select(this._layout.content),i=e.config.settings.size;t.addTask((function(){return n._renderingPhase="spec"})),e.getDrawScenarioQueue({allocateRect:function(){return {slot:function(t){return r.selectAll(".uid_"+t)},frameId:"root",left:0,top:0,width:i.width,containerWidth:i.width,height:i.height,containerHeight:i.height}}}).forEach((function(e){return t.addTask(e)}));},e.prototype._scheduleDrawing=function(t,e){var n=this,r=e.config.settings.size;t.addTask((function(t){n._renderingPhase="draw",n._renderRoot({scenario:t,newSize:r}),n._cancelPointerAnimationFrame(),n._scheduleRenderScenario(t);}));},e.prototype._resetProgressLayout=function(){this._createProgressBar(),this._clearRenderingError(),this._clearTimeoutWarning();},e.prototype._renderRoot=function(t){var e=this,n=t.scenario,r=t.newSize,i=er.select(this._layout.content),o=n[0].config.uid,a=nr(i,"svg").attr("width",Math.floor(r.width)).attr("height",Math.floor(r.height));a.attr("class")||a.attr("class","tau-chart__svg"),this._svg=a.node(),this._initPointerEvents(),this.fire("beforerender",this._svg);var u=a.selectAll("g.frame-root").data([o],(function(t){return t}));u.enter().append("g").classed("tau-chart__cell cell frame-root uid_"+o,!0).merge(u).call((function(t){t.classed("tau-active",!0),it(t,e.configGPL.settings.animationSpeed,"frameRootToggle").attr("opacity",1);})),u.exit().call((function(t){t.classed("tau-active",!1),it(t,e.configGPL.settings.animationSpeed,"frameRootToggle").attr("opacity",1e-6).remove();}));},e.prototype._scheduleRenderScenario=function(t){var e=this;t.forEach((function(t){e._taskRunner.addTask((function(){t.draw(),e.onUnitDraw(t.node()),e._renderedItems.push(t);}));}));},e.prototype._completeRendering=function(){ve(this._layout.contentContainer),this._layout.rightSidebar.style.maxHeight=this._liveSpec.settings.size.height+"px",this.enablePointerEvents(),this._svg&&this.fire("render",this._svg),ve(this._layout.rightSidebarContainer,"vertical");},e.prototype._cancelRendering=function(){this.enablePointerEvents(),this._resetTaskRunner(),this._cancelPointerAnimationFrame();},e.prototype._createProgressBar=function(){var t=er.select(this._layout.header),e=nr(t,"div.tau-chart__progress");e.select("div.tau-chart__progress__value").remove();var n=e.append("div").classed("tau-chart__progress__value",!0).style("width",0);this._reportProgress=function(t){requestAnimationFrame((function(){e.classed("tau-chart__progress_active",t<1),n.style("width",100*t+"%");}));};},e.prototype._displayRenderingError=function(t){this._layout.layout.classList.add("tau-chart__layout_rendering-error");},e.prototype._clearRenderingError=function(){this._layout.layout.classList.remove("tau-chart__layout_rendering-error");},e.prototype.getScaleFactory=function(t){return void 0===t&&(t=null),new an(on.instance(this._liveSpec.settings),t||this._liveSpec.sources,this._liveSpec.scales)},e.prototype.getScaleInfo=function(t,e){return void 0===e&&(e=null),this.getScaleFactory().createScaleInfoByName(t,e)},e.prototype.getSourceFiltersIterator=function(t){var e=this,n=$t(Object.keys(this._filtersStore.filters).map((function(t){return e._filtersStore.filters[t]}))).filter((function(e){return !t(e)})).map((function(t){return t.predicate}));return function(t){return n.reduce((function(e,n){return e&&n(t)}),!0)}},e.prototype.getDataSources=function(t){var e=this;void 0===t&&(t={});var n=this._chartDataModel(this._originData);return Object.keys(n).filter((function(t){return "?"!==t})).reduce((function(r,i){var o=n[i],a=e.getSourceFiltersIterator(function(e){return function(n){return t.excludeFilter&&-1!==t.excludeFilter.indexOf(n.tag)||n.src!==e}}(i));return r[i]={dims:o.dims,data:o.data.filter(a)},r}),{"?":n["?"]})},e.prototype.isEmptySources=function(t){return !Object.keys(t).filter((function(t){return "?"!==t})).filter((function(e){return t[e].data.length>0})).length},e.prototype.getChartModelData=function(t,e){return void 0===t&&(t={}),void 0===e&&(e="/"),this.getDataSources(t)[e].data},e.prototype.getDataDims=function(t){return void 0===t&&(t="/"),this._originData[t].dims},e.prototype.getData=function(t){return void 0===t&&(t="/"),this._originData[t].data},e.prototype.setData=function(t,e){void 0===e&&(e="/"),this._originData[e].data=t,this.refresh();},e.prototype.getSVG=function(){return this._svg},e.prototype.addFilter=function(t){t.src=t.src||"/";var e=t.tag,n=this._filtersStore.filters[e]=this._filtersStore.filters[e]||[],r=this._filtersStore.tick++;return t.id=r,n.push(t),r},e.prototype.removeFilter=function(t){var e=this;return Object.keys(this._filtersStore.filters).map((function(n){e._filtersStore.filters[n]=e._filtersStore.filters[n].filter((function(e){return e.id!==t}));})),this},e.prototype.refresh=function(){this._target&&this.renderTo(this._target,this._defaultSize);},e.prototype.resize=function(t){void 0===t&&(t={}),this.renderTo(this._target,t);},e.prototype.select=function(t){return this._nodes.filter(t)},e.prototype.traverseSpec=function(t,e){var n=function(t,e,r,i){e(t,r,i),t.frames?t.frames.forEach((function(r){(r.units||[]).map((function(i){return n(i,e,t,r)}));})):(t.units||[]).map((function(r){return n(r,e,t,null)}));};n(t.unit,e,null,null);},e.prototype.getSpec=function(){return this._liveSpec},e.prototype.getLayout=function(){return this._layout},e.prototype._displayTimeoutWarning=function(t){var e=this,n=t.proceed,r=t.cancel,i=t.timeout,o=Math.round(100/3/1.5),a=function(t){return Math.round(100/3/1.5*t)};this._layout.content.style.height="100%",this._layout.content.insertAdjacentHTML("beforeend",'\n            <div class="tau-chart__rendering-timeout-warning">\n            <svg\n                viewBox="0 0 200 100">\n                <text\n                    text-anchor="middle"\n                    font-size="'+o+'">\n                    <tspan x="100" y="'+a(1)+'">Rendering took more than '+Math.round(i)/1e3+'s</tspan>\n                    <tspan x="100" y="'+a(2)+'">Would you like to continue?</tspan>\n                </text>\n                <text\n                    class="'+qe+'rendering-timeout-continue-btn"\n                    text-anchor="end"\n                    font-size="'+o+'"\n                    cursor="pointer"\n                    text-decoration="underline"\n                    x="'+(100-o/3)+'"\n                    y="'+a(3)+'">\n                    Continue\n                </text>\n                <text\n                    class="'+qe+'rendering-timeout-cancel-btn"\n                    text-anchor="start"\n                    font-size="'+o+'"\n                    cursor="pointer"\n                    text-decoration="underline"\n                    x="'+(100+o/3)+'"\n                    y="'+a(3)+'">\n                    Cancel\n                </text>\n            </svg>\n            </div>\n        '),this._layout.content.querySelector(".tau-chart__rendering-timeout-continue-btn").addEventListener("click",(function(){e._clearTimeoutWarning(),n.call(e);})),this._layout.content.querySelector(".tau-chart__rendering-timeout-cancel-btn").addEventListener("click",(function(){e._clearTimeoutWarning(),r.call(e);}));},e.prototype._clearTimeoutWarning=function(){var t=rr(this._layout.content,".tau-chart__rendering-timeout-warning");t&&(this._layout.content.removeChild(t),this._layout.content.style.height="");},e}(h),or={},ar={},ur=function(t){var e="Chart type "+t+" is not supported.";throw console.log(e),console.log("Use one of "+Object.keys(or).join(", ")+"."),new w(e,S.NOT_SUPPORTED_TYPE_CHART)},sr={validate:function(t,e){return ar.hasOwnProperty(t)||ur(t),ar[t].reduce((function(t,n){return t.concat(n(e)||[])}),[])},get:function(t){var e=or[t];return "function"!=typeof e&&ur(t),e},add:function(t,e,n){return void 0===n&&(n=[]),or[t]=e,ar[t]=n,sr},getAllRegisteredTypes:function(){return or}},cr=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),lr=function(t){function e(n){var r=t.call(this,n)||this;return n.autoResize&&e.winAware.push(r),r}return cr(e,t),e.prototype.applyConfig=function(e){var n=sr.validate(e.type,e);if(n.length>0)throw new Error(n[0]);var r=sr.get(e.type);(e=te(e,{autoResize:!0})).settings=ir.setupSettings(e.settings),e.dimensions=ir.setupMetaInfo(e.dimensions,e.data),t.prototype.applyConfig.call(this,r(e));},e.prototype.destroy=function(){var n=e.winAware.indexOf(this);-1!==n&&e.winAware.splice(n,1),t.prototype.destroy.call(this);},e}(ir);function fr(t){return t}lr.winAware=[],lr.resizeOnWindowEvent=function(){var t;function e(){t=0;for(var e=0,n=lr.winAware.length;e<n;e++)lr.winAware[e].resize();}return function(){!t&&lr.winAware.length&&(t=window.requestAnimationFrame(e));}}(),window.addEventListener("resize",lr.resizeOnWindowEvent);function dr(t){return "translate("+(t+.5)+",0)"}function hr(t){return "translate(0,"+(t+.5)+")"}function pr(t){var e=Math.max(0,t.bandwidth()-1)/2;return t.round()&&(e=Math.round(e)),function(n){return t(n)+e}}var gr={top:1,right:2,bottom:3,left:4};function mr(t){var e=gr[t.scaleGuide.scaleOrient],n=t.scale,r=t.scaleGuide,i=r.label,o=te(t,{tickSize:6,tickPadding:3,gridOnly:!1}),a=o.ticksCount,u=o.tickFormat,s=o.tickSize,c=o.tickPadding,l=o.gridOnly,f="linear"===n.scaleType,d="ordinal"===n.scaleType||"period"===n.scaleType,h=e===gr.top||e===gr.bottom,p=e===gr.top||e===gr.left?-1:1,g=h?"x":"y",m=h?"y":"x",y=h?dr:hr,v=h?1:-1;return function(o){var b;if(n.ticks){b=n.ticks(a);for(var x=Math.floor(1.25*a);b.length>x&&x>2&&b.length>2;)b=n.ticks(--x);}else b=n.domain();r.hideTicks&&(b=l?b.filter((function(t){return 0==t})):[]);var _=null==u?n.tickFormat?n.tickFormat(a):fr:u,w=Math.max(s,0)+c,S=n.range(),M=S[0]+.5,O=S[S.length-1]+.5,k=(n.bandwidth?pr:fr)(n);if(r.facetAxis){var A=k;k=function(t){return A(t)-n.stepSize(t)/2};}var T,E=o.selection?o:null,C=E?E.selection():o,N=function(t){for(var e=t.node();e&&"svg"!==e.tagName;)e=e.parentNode;return e}(C).getBoundingClientRect();function L(t){var n=qt(r.rotate);if(t.attr("transform",Le(n)),Math.abs(n/90)%2>0){var i=n<180?1:-1,o=(h?.5:-2)*(e===gr.top||e===gr.bottom?(e===gr.top||e===gr.left?-1:1)<0?0:.71:.32);t.attr("x",9*i).attr("y",0).attr("dx",h?null:o+"em").attr("dy",o+"em");}}function j(t,e){void 0===e&&(e=0);var i,o,a,u=function(t){return Math.max(n.stepSize(t),r.tickFormatWordWrapLimit,e)};r.tickFormatWordWrap?function(t,e,n,r,i,o){o=o||rt();var a=function(t,e,n,r,i,o,a){var u=a*n+o;return t.append("tspan").attr("x",r).attr("y",i).attr("dy",u+"em").text(e)};t.each((function(){var t=nt.select(this.parentNode).data()[0],u=e(t),s=nt.select(this),c=s.text().split(/\s+/),l=s.attr("x"),f=s.attr("y"),d=parseFloat(s.attr("dy"));s.text(null);var h=a(s,null,1.1,l,f,d,0),p=!1,g=c.length-1,m=c.reduce((function(t,e,r){if(p)return t;var i=t.length===n||r===g,a=t[t.length-1],s=""!==a?a+" "+e:e,c=o(h.text(s)),l=c>u;if(l&&i){var f=Math.floor(u/c*s.length);t[t.length-1]=s.substr(0,f-4)+"...",p=!0;}return l&&!i&&t.push(e),l||(t[t.length-1]=s),t}),[""]).filter((function(t){return t.length>0}));f=i?-1*(m.length-1)*Math.floor(.5*r):f,m.forEach((function(t,e){return a(s,t,1.1,l,f,d,e)})),h.remove();}));}(t,u,r.tickFormatWordWrapLines,r.tickFontHeight,!h):(i=t,o=u,a=a||rt(),i.each((function(){var t=nt.select(this.parentNode).data()[0],e=o(t),n=nt.select(this),r=n.text().split(/\s+/),i=!1,u=r.reduce((function(t,r,o){if(i)return t;var u=o>0?[t,r].join(" "):r,s=a(n.text(u));if(s<e)t=u;else {var c=Math.floor(e/s*u.length);t=u.substr(0,c-4)+"...",i=!0;}return t}),"");n.text(u);})));}function P(t){!function(t,e){var n=e?-10:20,r=e?0:1,i=e?1:-1,o=[];t.each((function(){var t=nt.select(this),e=t.attr("transform").replace("translate(","").replace(" ",",").split(",")[r],n=i*parseFloat(e),a=t.select("text"),u=a.node().getBBox().width/2,s=n-u,c=n+u;o.push({c:n,s:s,e:c,l:0,textRef:a,tickRef:t});}));var a,u=o.sort((function(t,e){return t.c-e.c}));a=function(t,r,i){var o=t.e>r.s,a=i.s<r.e;if(o||a){r.l=function(t,e){var n={"[T][1]":-1,"[T][-1]":0,"[T][0]":1,"[F][0]":-1},r="["+e.toString().toUpperCase().charAt(0)+"]["+t+"]";return n.hasOwnProperty(r)?n[r]:0}(t.l,o);var u=r.textRef.size(),s=r.textRef.text();u>1&&(s=s.replace(/([.]*$)/gi,"")+"...");var c=11*r.l,l=e?parseFloat(r.textRef.attr("y"))+c:0,f=e?0:c,d=e?c:0,h=function(t){var e=0;if(!t)return e;var n=t.indexOf("rotate(");if(n>=0){var r=t.indexOf(")",n+7),i=t.substring(n+7,r);e=parseFloat(i.trim());}return e}(r.textRef.attr("transform"));r.textRef.text((function(t,e){return 0===e?s:""})).attr("transform","translate("+f+","+d+") rotate("+h+")");var p={x1:0,x2:0,y1:l+(e?-1:5),y2:n};e||(p.transform="rotate(-90)"),Oe(r.tickRef,"line.label-ref").call(dt(p));}else r.tickRef.selectAll("line.label-ref").remove();return r},u.map((function(t,e,n){return a(n[e-1]||{e:-1/0,s:-1/0,l:0},t,n[e+1]||{e:1/0,s:1/0,l:0})}));}(t,h);}C.attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",e===gr.right?"start":e===gr.left?"end":"middle"),l||(T=r.hideTicks||r.hide?[]:[null],le(C.selectAll(".domain").data(T)).then((function(t){return E&&t.exit().transition(E).attr("opacity",0).remove(),t.merge(t.enter().insert("path",".tick").attr("class","domain").attr("opacity",1).attr("stroke","#000"))})).then((function(t){return E?t.transition(E):t})).then((function(t){t.attr("d",e===gr.left||e==gr.right?"M"+p*s+","+M+"H0.5V"+O+"H"+p*s:"M"+M+","+p*s+"V0.5H"+O+"V"+p*s);})));var F=le(C.selectAll(".tick").data(b,(function(t){return String(n(t))})).order()).then((function(t){var e=t.exit(),n=t.enter().append("g").attr("class","tick");return {tickExit:e,tickEnter:n,tick:t.merge(n)}})).then((function(t){if(f){var e=n.ticks(),r=n.domain(),i=b.length-1,o=e.length>1&&r[0]*r[1]<0&&-r[0]>(e[1]-e[0])/2&&r[1]>(e[i]-e[i-1])/2;t.tick.classed("zero-tick",(function(t){return 0==t&&o}));}return t})).result();!function(t){le(t).then((function(t){var e=t.tickEnter,n=t.tickExit,r=t.tick;return E?(e.attr("opacity",1e-6).attr("transform",(function(t){var e=k(t);return y(e)})),{tick:r.transition(E),tickExit:n.transition(E).attr("opacity",1e-6).attr("transform",(function(t){var e=k(t);return isFinite(e)?y(e):this.getAttribute("transform")}))}):{tick:r,tickExit:n}})).then((function(t){var e=t.tick;t.tickExit.remove(),e.attr("opacity",1).attr("transform",(function(t){return y(k(t))}));}));}(F),r.facetAxis||function(t){var e=p*s,r=d?function(t){return v*n.stepSize(t)/2}:null;le(t).then((function(t){var n=t.tick,i=t.tickEnter,o=n.select("line"),a=i.append("line").attr("stroke","#000").attr(m+"2",e);return d&&a.attr(g+"1",r).attr(g+"2",r),o.merge(a)})).then((function(t){return E?t.transition(E):t})).then((function(t){t.attr(m+"2",e),d&&t.attr(g+"1",r).attr(g+"2",r);}));}(F),d&&l&&d&&b&&b.length&&le(C.selectAll(".extra-tick-line").data([null])).then((function(t){return t.merge(t.enter().insert("line",".tick").attr("class","extra-tick-line").attr("stroke","#000"))})).then((function(t){return E?t.transition(E):t})).then((function(t){t.attr(g+"1",M).attr(g+"2",M).attr(m+"1",0).attr(m+"2",p*s);})),l||(function(i){var o=r.textAnchor,a=p*w,u=e===gr.top?"0em":e===gr.bottom?"0.71em":"0.32em";function s(e){if(r.facetAxis)return e.attr("dx",18-t.position[0]).attr("dy",16)}le(i).then((function(t){var e=t.tick,n=t.tickEnter,r=e.select("text"),i=n.append("text").attr("fill","#000").attr(m,a).attr("dy",u);return L(i),s(i),r.merge(i)})).then((function(t){if(t.text(_).attr("text-anchor",o),!1===h&&!0===r.facetAxis){var e=Pe(C.node().parentNode.getAttribute("transform"));j(t,N.width-Math.abs(e.x));}else j(t);return h&&"time"===n.scaleType&&function(t){if(b.length<2)return;var e=0,n=-1,r=t.nodes();r.forEach((function(t,r){var i=(t.textContent||"").length;i>e&&(e=i,n=r);}));var i=k(b[1])-k(b[0]),o=!1;if(n>=0){var a=r[n].getBoundingClientRect();o=i-a.width<8;}C.classed("tau-chart__time-axis-overflow",o);}(t),!h||"time"!==n.scaleType&&"linear"!==n.scaleType||function(t){if(0===b.length)return;var e=b[0],n=b[b.length-1],r=C.append("line").attr("x1",k(e)).attr("x2",k(e)).attr("y1",0).attr("y2",1),i=C.append("line").attr("x1",k(n)).attr("x2",k(n)).attr("y1",0).attr("y2",1),o={left:r.node().getBoundingClientRect().left-N.left,right:N.right-i.node().getBoundingClientRect().right};r.remove(),i.remove();var a=function(t,e,n){var r=t.getBoundingClientRect(),i=e>0?"right":"left",a=(k(n),o[i]),u=Math.ceil(r.width/2-a+1);t.setAttribute("dx",String(u>0?-e*u:0));},u=t.filter((function(t){return t===e})).node(),s=t.filter((function(t){return t===n})).node();t.attr("dx",null),a(u,-1,e),a(s,1,n);}(t),t})).then((function(t){return E?t.transition(E):t})).then((function(t){t.attr(m,a),L(t),s(t),d&&r.avoidCollisions&&!r.facetAxis&&(E?E.on("end.fixTickTextCollision",(function(){return P(i.tick)})):P(i.tick));}));}(F),i.hide||function(){var t=i,e=Oe(C,"text.label").attr("class",Ee("label",t.cssClass)).attr("transform",Le(t.rotate)).attr("text-anchor",t.textAnchor);le(e).then((function(t){return E?t.transition(E):t})).then((function(e){var n=v*t.padding,r=Math.abs(O-M),i=h?r:0;e.attr("x",i).attr("y",n);}));for(var n=t.text.split(" → "),r=n.length-1;r>0;r--)n.splice(r,0," → ");var o=e.selectAll("tspan").data(n).enter().append("tspan").attr("opacity",1e-6).attr("class",(function(t,e){return e%2?"label-token-delimiter label-token-delimiter-"+e:"label-token label-token-"+e})).text((function(t){return t})),a=o.exit();E&&(o=o.transition(E),a=a.transition(E).attr("opacity",1e-6)),o.attr("opacity",1),a.remove();}());}}function yr(t){return mr({scale:t.scale,scaleGuide:t.scaleGuide,ticksCount:t.ticksCount,tickSize:t.tickSize,gridOnly:!0,position:t.position})}var vr=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),br=Oe,xr=function(t){var e=t<=20?1:.75;return Math.max(2,Math.round(t*e))},_r=function(t){function e(e){var n=t.call(this,e)||this;n.config=e,n.config.guide=te(n.config.guide||{},{showGridLines:"xy",padding:{l:50,r:0,t:0,b:50}}),n.config.guide.x=n.config.guide.x||{},n.config.guide.x=te(n.config.guide.x,{cssClass:"x axis",textAnchor:"middle",padding:10,hide:!1,scaleOrient:"bottom",rotate:0,density:20,label:{},tickFormatWordWrapLimit:100}),"string"==typeof n.config.guide.x.label&&(n.config.guide.x.label={text:n.config.guide.x.label}),n.config.guide.x.label=te(n.config.guide.x.label,{text:"X",rotate:0,padding:40,textAnchor:"middle"}),n.config.guide.y=n.config.guide.y||{},n.config.guide.y=te(n.config.guide.y,{cssClass:"y axis",textAnchor:"start",padding:10,hide:!1,scaleOrient:"left",rotate:0,density:20,label:{},tickFormatWordWrapLimit:100}),"string"==typeof n.config.guide.y.label&&(n.config.guide.y.label={text:n.config.guide.y.label}),n.config.guide.y.label=te(n.config.guide.y.label,{text:"Y",rotate:-90,padding:20,textAnchor:"middle"});var r=n.config,i=r.guide;if("extract-axes"===i.autoLayout){var o=r.options.containerHeight-(r.options.top+r.options.height);i.x.hide=i.x.hide||Math.floor(o)>0,i.y.hide=i.y.hide||Math.floor(r.options.left)>0;}var a=n.config.options,u=n.config.guide.padding;return n.L=a.left+u.l,n.T=a.top+u.t,n.W=a.width-(u.l+u.r),n.H=a.height-(u.t+u.b),n}return vr(e,t),e.prototype.defineGrammarModel=function(t){var e=this.W,n=this.H;return this.xScale=t("pos",this.config.x,[0,e]),this.yScale=t("pos",this.config.y,(function(t){return ["ordinal","period"].indexOf(t.type)>=0?[0,n]:[n,0]})),this.regScale("x",this.xScale).regScale("y",this.yScale),{scaleX:this.xScale,scaleY:this.yScale,xi:function(){return e/2},yi:function(){return n/2},sizeX:function(){return e},sizeY:function(){return n}}},e.prototype.getGrammarRules=function(){return [function(t){var e=t.scaleX,n=t.scaleY;return {xi:function(n){return n?e(n[e.dim]):t.xi(n)},yi:function(e){return e?n(e[n.dim]):t.yi(e)},sizeX:function(n){return n?e.stepSize(n[e.dim]):t.sizeX(n)},sizeY:function(e){return e?n.stepSize(e[n.dim]):t.sizeY(e)}}}]},e.prototype.createScreenModel=function(t){return t},e.prototype.allocateRect=function(t){var e=this,n=this.screenModel;return {slot:function(t){return e.config.options.container.selectAll(".uid_"+t)},left:n.xi(t)-n.sizeX(t)/2,top:n.yi(t)-n.sizeY(t)/2,width:n.sizeX(t),height:n.sizeY(t),containerWidth:this.W,containerHeight:this.H}},e.prototype.drawFrames=function(t){var e=Object.assign({},this.config),n=e.options,r=this.W,i=this.H;if(e.x=this.xScale,e.y=this.yScale,e.x.scaleObj=this.xScale,e.y.scaleObj=this.yScale,e.x.guide=e.guide.x,e.y.guide=e.guide.y,e.x.guide.label.size=r,e.y.guide.label.size=i,(n.container.attr("transform")?it(n.container,this.config.guide.animationSpeed,"cartesianContainerTransform"):n.container).attr("transform",Ne(this.L,this.T)),e.x.guide.hide)this._removeDimAxis(n.container,e.x);else {var o="top"===e.x.guide.scaleOrient?[0,0-e.guide.x.padding]:[0,i+e.guide.x.padding];this._drawDimAxis(n.container,e.x,o,r);}if(e.y.guide.hide)this._removeDimAxis(n.container,e.y);else {var a="right"===e.y.guide.scaleOrient?[r+e.guide.y.padding,0]:[0-e.guide.y.padding,0];this._drawDimAxis(n.container,e.y,a,i);}var u=t.reduce((function(t,e){return t.concat((e.units||[]).map((function(t){return t.uid})))}),[]),s=this._drawGrid(n.container,e,r,i,n),c=lt(s,".cell").data(u,(function(t){return t}));c.enter().append("g").attr("class",(function(t){return "tau-chart__cell cell uid_"+t})).merge(c).classed("tau-active",!0),it(c,this.config.guide.animationSpeed).attr("opacity",1),it(c.exit().classed("tau-active",!1),this.config.guide.animationSpeed).attr("opacity",1e-6).remove();},e.prototype._drawDimAxis=function(t,e,n,r){var i=Sn.get(e.guide.tickFormat,e.guide.tickFormatNullAlias),a=mr({scale:e.scaleObj,scaleGuide:e.guide,ticksCount:i?xr(r/e.guide.density):null,tickFormat:i||null,position:n}),u=this.config.guide.animationSpeed;br(t,this._getAxisSelector(e)).classed("tau-active",!0).classed(e.guide.cssClass,!0).call((function(t){var e=it(t,u,"axisTransition"),r=t.attr("transform");Ne.apply(o,n)!==r&&(r?e:t).attr("transform",Ne.apply(o,n)),e.call(a),e.attr("opacity",1);}));},e.prototype._removeDimAxis=function(t,e){var n=lt(t,this._getAxisSelector(e)).classed("tau-active",!1);it(n,this.config.guide.animationSpeed,"axisTransition").attr("opacity",1e-6).remove();},e.prototype._getAxisSelector=function(t){return "g."+("h"===je(t.guide.scaleOrient)?"x":"y")+".axis"},e.prototype._drawGrid=function(t,e,n,r){var i=this;return br(t,"g.grid").attr("transform",Ne(0,0)).call((function(t){var o=t,a=i.config.guide.animationSpeed,u=(e.guide.showGridLines||"").toLowerCase();if(u.length>0){var s=br(o,"g.grid-lines");if(u.indexOf("x")>-1){var c=e.x,l=Sn.get(c.guide.tickFormat),f=yr({scale:c.scaleObj,scaleGuide:c.guide,tickSize:r,ticksCount:l?xr(n/c.guide.density):null}),d=br(s,"g.grid-lines-x");it(d,a).call(f);}if(u.indexOf("y")>-1){var h=e.y,p=(l=Sn.get(h.guide.tickFormat),yr({scale:h.scaleObj,scaleGuide:h.guide,tickSize:-n,ticksCount:l?xr(r/h.guide.density):null})),g=br(s,"g.grid-lines-y");it(g,a).call(p);}}}))},e}(m),wr=n(11),Sr=n(8),Mr=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),Or=function(){return (Or=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},kr=Or({},wr,Sr,a),Ar=function(t){function e(e){var n=t.call(this,e)||this;n.config=e,n.config.guide=te(n.config.guide||{},{padding:{l:50,r:50,t:50,b:50},enableBrushing:!1}),n.columnsBrushes={},n.columnsSelections={},n.on("force-brush",(function(t,e){return n._forceBrushing(e)}));var r=n.config.options,i=n.config.guide.padding;return n.L=r.left+i.l,n.T=r.top+i.t,n.W=r.width-(i.l+i.r),n.H=r.height-(i.t+i.b),n}return Mr(e,t),e.prototype.defineGrammarModel=function(t){var e=this.config,n=this.W,r=this.H;this.columnsScalesMap=e.columns.reduce((function(e,n){return e[n]=t("pos",n,[0,r]),e}),{});var i=n/(e.columns.length-1),o=e.columns.reduce((function(t,e,n){return t[e]=n*i,t}),{});return this.xBase=function(t){return o[t]},this.regScale("columns",this.columnsScalesMap),{}},e.prototype.allocateRect=function(){var t=this;return {slot:function(e){return t.config.options.container.selectAll(".uid_"+e)},left:0,top:0,width:this.W,height:this.H,containerWidth:this.W,containerHeight:this.H}},e.prototype.drawFrames=function(t){var e=this,n=Object.assign({},this.config),r=n.options,i=this._fnDrawGrid(r.container,n,r.frameId,Object.keys(this.columnsScalesMap).reduce((function(t,n){return t.concat([e.columnsScalesMap[n].getHash()])}),[]).join("_")),o=i.selectAll(".parent-frame-"+r.frameId).data(t,(function(t){return t.hash()}));o.exit().remove(),o.enter().append("g").attr("class",(function(t){return "tau-chart__cell cell parent-frame-"+r.frameId+" frame-"+t.hash()})).merge(o).each((function(t){var e,n,i,o;e=r.frameId,n=kr.select(this),i=t,(o=n.selectAll(".layer_"+e).data(i.units,(function(t){return t.uid}))).exit().remove(),o.enter().append("g").attr("class",(function(t){return "layer_"+e+" uid_"+t.uid}));}));var a=this._fnDrawColumns(i,n);n.guide.enableBrushing&&this._enableBrushing(a);},e.prototype._fnDrawGrid=function(t,e,n,r){var i=t.selectAll(".grid_"+n).data([r],(function(t){return t}));return i.exit().remove(),i.enter().append("g").attr("class","grid grid_"+n).attr("transform",Ne(this.L,this.T)).merge(i)},e.prototype._fnDrawColumns=function(t,e){var n=e.guide.columns||{},r=this.xBase,i=this.columnsScalesMap,o=kr.axisLeft(),a=t.selectAll(".column").data(e.columns,(function(t){return t}));return a.exit().remove(),a.enter().append("g").attr("class","column").attr("transform",(function(t){return Ne(r(t),0)})).call((function(t){t.append("g").attr("class","y axis").each((function(t){var e=i[t].dim,r=o.scale(i[t]),a=n[e]||{},u=Sn.get(a.tickFormat,a.tickFormatNullAlias);null!==u&&r.tickFormat(u),kr.select(this).call(r);})).append("text").attr("class","label").attr("text-anchor","middle").attr("y",-9).text((function(t){return ((n[t]||{}).label||{}).text||i[t].dim}));})).merge(a)},e.prototype._enableBrushing=function(t){var e=this,n=this.columnsSelections,r=this.columnsScalesMap,i=this.columnsBrushes,o=!0,u=function(t){return t},s=function(t){return t},c=function(){var t=Object.keys(i).find((function(t){return i[t]===a.event.target}));if(n[t]=a.event.selection,o){var u=Object.keys(i).filter((function(t){return n[t]})).map((function(t){var e=[];if(r[t].discrete){var i=n[t];e=r[t].domain().filter((function(e){var n=r[t](e);return i[0]<=n&&i[1]>=n}));}else {var o=n[t].map(r[t].invert);e=[o[0],o[1]];}return {dim:r[t].dim,func:r[t].discrete?"inset":"between",args:e}}));e.fire("brush",u);}};return t.selectAll(".brush").remove(),t.append("g").attr("class","brush").each((function(t){var e=r[t].range();i[t]=kr.brushY().extent([[0,e[0]],[16,e[1]]]).on("start",u).on("brush",c).on("end",s),kr.select(this).classed("brush-"+Rt(t),!0).call(i[t]),o=!1,i[t].move(kr.select(this),e),o=!0;})).selectAll("rect").attr("transform","translate(-8,0)").attr("width",16),t},e.prototype._forceBrushing=function(t){void 0===t&&(t={});var e=this.columnsBrushes,n=this.columnsScalesMap;this.columnsSelections;Object.keys(t).filter((function(r){return e[r]&&n[r]&&t[r]})).forEach((function(r){var i=t[r],o=[];if(n[r].discrete){var a=i.map(n[r]).filter((function(t){return t>=0})),u=n[r].stepSize()/2;o=[Math.min.apply(Math,a)-u,Math.max.apply(Math,a)+u];}else o=[i[0],i[1]];var s=Rt(r);e[r](kr.select(".brush-"+s)),e[r].move(kr.select(".brush-"+s),o.map(n[r]));}));},e}(m),Tr=n(12);var Er=n(4),Cr=function(){var t,e=[],n=[],r=1,i=1,o={},a=!1,u=function(t){var r=e.length,i=0,o=e[t].x-n[t].x,a=n[t].y-e[t].y,u=Math.sqrt(o*o+a*a);u>0&&(i+=.2*u),a/=u,i+=(o/=u)>0&&a>0?0:o<0&&a>0?3:o<0&&a<0?6:9;for(var s,c,f,d,h=e[t].x,p=e[t].y-e[t].height+2,g=e[t].x+e[t].width,m=e[t].y+2,y=0;y<r;y++)y!=t&&(l(n[t].x,e[t].x,n[y].x,e[y].x,n[t].y,e[t].y,n[y].y,e[y].y)&&(i+=1),s=e[y].x,f=e[y].y-e[y].height+2,c=e[y].x+e[y].width,d=e[y].y+2,i+=30*(Math.max(0,Math.min(c,g)-Math.max(s,h))*Math.max(0,Math.min(d,m)-Math.max(f,p)))),s=n[y].x-n[y].r,f=n[y].y-n[y].r,c=n[y].x+n[y].r,d=n[y].y+n[y].r,i+=30*(Math.max(0,Math.min(c,g)-Math.max(s,h))*Math.max(0,Math.min(d,m)-Math.max(f,p)));return i},s=function(o){var s,c=Math.floor(Math.random()*e.length),l=e[c].x,f=e[c].y;s=a?t(c,e,n):u(c),e[c].x+=5*(Math.random()-.5),e[c].y+=5*(Math.random()-.5),e[c].x>r&&(e[c].x=l),e[c].x<0&&(e[c].x=l),e[c].y>i&&(e[c].y=f),e[c].y<0&&(e[c].y=f);var d=(a?t(c,e,n):u(c))-s;Math.random()<Math.exp(-d/o)?1:(e[c].x=l,e[c].y=f,1);},c=function(o){var s,c=Math.floor(Math.random()*e.length),l=e[c].x,f=e[c].y;s=a?t(c,e,n):u(c);var d=.5*(Math.random()-.5),h=Math.sin(d),p=Math.cos(d);e[c].x-=n[c].x,e[c].y-=n[c].y;var g=e[c].x*p-e[c].y*h,m=e[c].x*h+e[c].y*p;e[c].x=g+n[c].x,e[c].y=m+n[c].y,e[c].x>r&&(e[c].x=l),e[c].x<0&&(e[c].x=l),e[c].y>i&&(e[c].y=f),e[c].y<0&&(e[c].y=f);var y=(a?t(c,e,n):u(c))-s;Math.random()<Math.exp(-y/o)?1:(e[c].x=l,e[c].y=f,1);},l=function(t,e,n,r,i,o,a,u){var s,c,l;return c=((e-t)*(i-a)-(o-i)*(t-n))/(l=(u-a)*(e-t)-(r-n)*(o-i)),!((s=((r-n)*(i-a)-(u-a)*(t-n))/l)<0||s>1||c<0||c>1)},f=function(t,e,n){return t-e/n};return o.start=function(t){for(var n=e.length,r=1,i=0;i<t;i++){for(var o=0;o<n;o++)Math.random()<.5?s(r):c(r);r=f(r,1,t);}},o.width=function(t){return arguments.length?(r=t,o):r},o.height=function(t){return arguments.length?(i=t,o):i},o.label=function(t){return arguments.length?(e=t,o):e},o.anchor=function(t){return arguments.length?(n=t,o):n},o.alt_energy=function(e){return arguments.length?(t=e,a=!0,o):u},o.alt_schedule=function(){return arguments.length?o:f},o},Nr=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),Lr=function(){return (Lr=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},jr=Lr({},u,Tr,a),Pr=["land","continents","georegions","countries","regions","subunits","states","counties"],Fr=function(t){function e(e){var n=t.call(this,e)||this;return n.config=e,n.config.guide=te(n.config.guide||{},{defaultFill:"rgba(128,128,128,0.25)",padding:{l:0,r:0,t:0,b:0},showNames:!0}),n.contourToFill=null,n.on("highlight-area",(function(t,e){return n._highlightArea(e)})),n.on("highlight-point",(function(t,e){return n._highlightPoint(e)})),n.on("highlight",(function(t,e){return n._highlightPoint(e)})),n}return Nr(e,t),e.prototype.defineGrammarModel=function(t){var e=this.config,n=e.options,r=e.guide.padding,i=n.width-(r.l+r.r),o=n.height-(r.t+r.b);return this.latScale=t("pos",e.latitude,[0,o]),this.lonScale=t("pos",e.longitude,[i,0]),this.sizeScale=t("size",e.size),this.colorScale=t("color",e.color),this.codeScale=t("value",e.code),this.fillScale=t("fill",e.fill),this.W=i,this.H=o,this.regScale("latitude",this.latScale).regScale("longitude",this.lonScale).regScale("size",this.sizeScale).regScale("color",this.colorScale).regScale("code",this.codeScale).regScale("fill",this.fillScale),{}},e.prototype.drawFrames=function(t){var e,n,r,i=this,o=this.config.guide;"string"==typeof o.sourcemap?(e=o.sourcemap,n=function(e,n){if(e)throw e;i._drawMap(t,n);},(r=new XMLHttpRequest).onload=function(){if(r.status>=200&&r.status<300){var t=r.responseText;try{n(null,JSON.parse(t));}catch(t){n(t,null);}}else n(new Error(r.status+": "+r.statusText),null);},r.onerror=function(t){n(t.error,null);},r.open("GET",e,!0),r.send(null)):this._drawMap(t,o.sourcemap);},e.prototype._calcLabels=function(t,e,n){var r=this.W,i=this.H,o={};return e.forEach((function(e){var a=(Er.feature(t,t.objects[e]).features||[]).map((function(t){var i=t.properties||{},o=n.centroid(t),a=n.bounds(t),u=o[0],s=o[1],c=a[1][0]-a[0][0],l=i.name||"",f=i.abbr||l,d=c<5.5*l.length?f:l,h=c<13.75,p=h?r-u-16.5:0;return {id:e+"-"+t.id,sx:u,sy:s,x:u+p,y:s,width:5.5*d.length,height:10,name:d,r:p,isRef:h}})).filter((function(t){return !Number.isNaN(t.x)&&!Number.isNaN(t.y)})),u=a.map((function(t){return {x:t.sx,y:t.sy,r:t.r}}));Cr().label(a).anchor(u).width(r).height(i).start(10),a.filter((function(t){return !t.isRef})).map((function(t){return t.x=t.sx,t.y=t.sy,t})).reduce((function(t,e){return t[e.id]=e,t}),o);var s=a.filter((function(t){return t.isRef}));s.length<6&&s.reduce((function(t,e){return t[e.id]=e,t}),o);})),o},e.prototype._drawMap=function(t,e){var n,r,i=this,o=this,u=this.config.guide,s=this.config.options,c=this.config.options.container,l=this.latScale,f=this.lonScale,d=this.sizeScale,h=this.colorScale,p=this.codeScale,g=this.fillScale,m=this.W,y=this.H,v=Pr.filter((function(t){return (e.objects||{}).hasOwnProperty(t)}));if(0===v.length)throw new Error("Invalid map: should contain some contours");if(g.dim){if(!p.georole)throw console.log("Specify [georole] for code scale"),new Error("[georole] is missing");if(-1===v.indexOf(p.georole))throw console.log('There is no contour for georole "'+p.georole+'"'),console.log("Available contours are: "+v.join(" | ")),new Error("Invalid [georole]");n=p.georole;}else n=v[v.length-1];if(this.contourToFill=n,l.dim&&f.dim){var b=jr.extent(l.domain()),x=jr.extent(f.domain());r=[(x[1]+x[0])/2,(b[1]+b[0])/2];}var _=this._createProjection(e,v[0],r),w=jr.geoPath().projection(_),S=c.selectAll(".map-container").data([""+m+y+r+v.join("-")],(function(t){return t}));S.exit().remove();var M=S.enter().append("g").call((function(t){var n=t;n.attr("class","map-container");var r={},i=v.reduceRight((function(t,e){return t.concat(e)}),[]);if(u.showNames&&(r=o._calcLabels(e,i,w)),i.forEach((function(t,i){var o=function(e){return r[t+"-"+e.id]};n.selectAll(".map-contour-"+t).data(Er.feature(e,e.objects[t]).features||[]).enter().append("g").call((function(e){var n=e;n.attr("class","map-contour-"+t+" map-contour-level map-contour-level-"+i).attr("fill","none"),n.append("title").text((function(t){return (t.properties||{}).name})),n.append("path").attr("d",w),n.append("text").attr("class","place-label-"+t).attr("transform",(function(t){var e=o(t);return e?"translate("+[e.x,e.y]+")":""})).text((function(t){var e=o(t);return e?e.name:""})),n.append("line").attr("class","place-label-link-"+t).attr("stroke","gray").attr("stroke-width",.25).attr("x1",(function(t){var e=o(t);return e&&e.isRef?e.sx:0})).attr("y1",(function(t){var e=o(t);return e&&e.isRef?e.sy:0})).attr("x2",(function(t){var e=o(t);return e&&e.isRef?e.x-.6*e.name.length*5.5:0})).attr("y2",(function(t){var e=o(t);return e&&e.isRef?e.y-3.5:0}));}));})),e.objects.hasOwnProperty("places")){var a=Er.feature(e,e.objects.places),s=a.features.map((function(t){var e=_(t.geometry.coordinates);return {x:e[0]+3.5,y:e[1]+3.5,width:5.5*t.properties.name.length,height:12,name:t.properties.name}})),c=a.features.map((function(t){var e=_(t.geometry.coordinates);return {x:e[0],y:e[1],r:2.5}}));Cr().label(s).anchor(c).width(m).height(y).start(100),n.selectAll(".place").data(c).enter().append("circle").attr("class","place").attr("transform",(function(t){return "translate("+t.x+","+t.y+")"})).attr("r",(function(t){return t.r+"px"})),n.selectAll(".place-label").data(s).enter().append("text").attr("class","place-label").attr("transform",(function(t){return "translate("+t.x+","+t.y+")"})).text((function(t){return t.name}));}})).merge(S);this.groupByCode=t.reduce((function(t,e){return e.part().reduce((function(t,e){return t[(e[p.dim]||"").toLowerCase()]=e,t}),t)}),{});var O=this._resolveFeature.bind(this);if(M.selectAll(".map-contour-"+n).data(Er.feature(e,e.objects[n]).features).call((function(t){t.classed("map-contour",!0).attr("fill",(function(t){var e=O(t);return null===e?u.defaultFill:g(e[g.dim])}));})).on("mouseover",(function(t){return i.fire("area-mouseover",{data:O(t),event:a.event})})).on("mouseout",(function(t){return i.fire("area-mouseout",{data:O(t),event:a.event})})).on("click",(function(t){return i.fire("area-click",{data:O(t),event:a.event})})),!l.dim||!f.dim)return [];var k=function(t){return t.attr("r",(function(t){return d(t[d.dim])})).attr("transform",(function(t){var e=t.data;return "translate("+_([e[f.dim],e[l.dim]])+")"})).attr("class",(function(t){var e=t.data;return h(e[h.dim])})).attr("opacity",.5).on("mouseover",(function(t){var e=t.data;return o.fire("point-mouseover",{data:e,event:a.event})})).on("mouseout",(function(t){var e=t.data;return o.fire("point-mouseout",{data:e,event:a.event})})).on("click",(function(t){var e=t.data;return o.fire("point-click",{data:e,event:a.event})}))},A=M.selectAll(".frame").data(t.map((function(t){return {tags:t.key||{},hash:t.hash(),data:t.part()}})),(function(t){return t.hash}));return A.exit().remove(),A.enter().append("g").merge(A).call((function(t){t.attr("class",(function(t){return "frame frame-"+t.hash})).call((function(t){var e=t.selectAll("circle").data((function(t){return t.data.map((function(t){return {data:t,uid:s.uid}}))}));e.exit().remove(),e.call(k),e.enter().append("circle").call(k);}));})),[]},e.prototype._resolveFeature=function(t){var e,n=this.groupByCode,r=t.properties,i=["c1","c2","c3","abbr","name"].filter((function(t){return r.hasOwnProperty(t)&&r[t]&&n.hasOwnProperty(r[t].toLowerCase())}));if(0===i.length)e=null;else if(i.length>0){var o=r[i[0]].toLowerCase();e=n[o];}return e},e.prototype._highlightArea=function(t){var e=this,n=this.config.options.container,r=this.contourToFill;n.selectAll(".map-contour-"+r).classed("map-contour-highlighted",(function(n){return t(e._resolveFeature(n))}));},e.prototype._highlightPoint=function(t){this.config.options.container.selectAll("circle").classed("map-point-highlighted",(function(e){var n=e.data;return t(n)})).attr("opacity",(function(e){var n=e.data;return t(n)?.5:.1}));},e.prototype._createProjection=function(t,e,n){var r=this.W,i=this.H,o=this.config.guide,a=100,u=[r/2,i/2],s=n||t.center,c=o.projection||t.projection||"mercator",l=this._createD3Projection(c,s,a,u),f=jr.geoPath().projection(l).bounds(Er.feature(t,t.objects[e])),d=a*r/(f[1][0]-f[0][0]),h=a*i/(f[1][1]-f[0][1]);return a=d<h?d:h,u=[r-(f[0][0]+f[1][0])/2,i-(f[0][1]+f[1][1])/2],this._createD3Projection(c,s,a,u)},e.prototype._createD3Projection=function(t,e,n,r){var i="geo"+t.substring(0,1).toUpperCase()+t.substring(1),o=jr[i];if(!o)throw console.log('Unknown projection "'+t+'"'),console.log("See available projection types here: https://github.com/mbostock/d3/wiki/Geo-Projections"),new Error('Invalid map: unknown projection "'+t+'"');var a=o();return [{method:"scale",args:n},{method:"center",args:e},{method:"translate",args:r}].filter((function(t){return t.args})).reduce((function(t,e){return t[e.method]&&(t=t[e.method](e.args)),t}),a)},e}(m),zr=function(t){return function(){return t}},Rr=function(){function t(t){this.model=t.model,this.x=t.x||zr(0),this.y=t.y||zr(0),this.dx=t.dx||zr(0),this.dy=t.dy||zr(0),this.w=t.w||zr(0),this.h=t.h||zr(0),this.hide=t.hide||zr(!1),this.label=t.label||zr(""),this.color=t.color||zr(""),this.angle=t.angle||zr(0),this.labelLinesAndSeparator=t.labelLinesAndSeparator||zr({lines:[],linesWidths:[],separator:""});}return t.seed=function(e,n){var r=n.fontColor,i=n.flip,o=n.formatter,a=n.labelRectSize,u=n.paddingKoeff,s=void 0===u?.5:u,c=n.lineBreakAvailable,l=n.lineBreakSeparator,f=i?e.yi:e.xi,d=i?e.xi:e.yi,h=function(t){return o(e.label(t))},p=function(t){var e=c?h(t).split(l):[h(t)];return {lines:e,linesWidths:e.map((function(t){return a([t]).width})),separator:l}};return new t({model:e,x:function(t){return f(t)},y:function(t){return d(t)},dy:function(t){return a(p(t).lines).height*s},w:function(t){return a(p(t).lines).width},h:function(t){return a(p(t).lines).height},label:h,labelLinesAndSeparator:p,color:function(){return r},angle:function(){return 0}})},t.compose=function(e,n){return void 0===n&&(n={}),Object.keys(n).reduce((function(t,e){return t[e]=n[e],t}),new t(e))},t}(),Dr={},Ir=function(){function t(){}return t.regRule=function(t,e){return Dr[t]=e,this},t.getRule=function(t){return Dr[t]},t}(),Br=function(t,e){var n=t.lines,r=t.linesWidths,i=t.separator;return n.map((function(t,n){var i=function(t,e,n){return n<e?Math.max(1,Math.floor(n*t.length/e))-1:t.length}(t,r[n],e);return i<t.length?function(t,e){return 0===e?"":t.slice(0,e).replace(/\.+$/g,"")+"…"}(t,i):t})).join(i)},Wr=function(t,e){var n=5-(t.labelLinesAndSeparator(e).lines.length-1);return n<1?1:n},Hr=function(t,e){return t.discrete||!t.discrete&&e[t.dim]>=0},Ur=function(t,e){return !t.discrete&&e[t.dim]<0},Gr=function(t,e){return t.w(e)/2+Math.floor(t.model.size(e)/Wr(t,e))},qr=function(t,e){return t.h(e)/2+Math.floor(t.model.size(e)/Wr(t,e))},Xr=function(t){return function(e){return {dx:function(n){var r=e.model.scaleY;if("+"===t[2]&&!Hr(r,n))return e.dx(n);if("-"===t[2]&&!Ur(r,n))return e.dx(n);var i=t[1],o=t[0]===t[0].toUpperCase()?1:0;return e.dx(n)+i*o*e.model.size(n)/2+i*Gr(e,n)}}}},Yr=function(t){return function(e){return {dy:function(n){var r=e.model.scaleY;if("+"===t[2]&&!Hr(r,n))return e.dy(n);if("-"===t[2]&&!Ur(r,n))return e.dy(n);var i=t[1],o=t[0]===t[0].toUpperCase()?1:0;return e.dy(n)+i*o*e.model.size(n)/2+i*qr(e,n)}}}};Ir.regRule("l",Xr(["l",-1,null])).regRule("L",Xr(["L",-1,null])).regRule("l+",Xr(["l",-1,"+"])).regRule("l-",Xr(["l",-1,"-"])).regRule("L+",Xr(["L",-1,"+"])).regRule("L-",Xr(["L",-1,"-"])).regRule("r",Xr(["r",1,null])).regRule("R",Xr(["R",1,null])).regRule("r+",Xr(["r",1,"+"])).regRule("r-",Xr(["r",1,"-"])).regRule("R+",Xr(["R",1,"+"])).regRule("R-",Xr(["R",1,"-"])).regRule("t",Yr(["t",-1,null])).regRule("T",Yr(["T",-1,null])).regRule("t+",Yr(["t",-1,"+"])).regRule("t-",Yr(["t",-1,"-"])).regRule("T+",Yr(["T",-1,"+"])).regRule("T-",Yr(["T",-1,"-"])).regRule("b",Yr(["b",1,null])).regRule("B",Yr(["B",1,null])).regRule("b+",Yr(["b",1,"+"])).regRule("b-",Yr(["b",1,"-"])).regRule("B+",Yr(["B",1,"+"])).regRule("B-",Yr(["B",1,"-"])).regRule("rotate-on-size-overflow",(function(t,e){var n=e.data,r=e.lineBreakAvailable,i={};if(n.reduce((function(e,n){return e+(function(e){return t.model.size(e)<t.w(e)}(n)?1:0)}),0)/n.length>.5){var o=r?-.5:.5;i={angle:function(){return -90},w:function(e){return t.h(e)},h:function(e){return t.w(e)},dx:function(e){return t.h(e)*o-2},dy:function(){return 0}};}return i})).regRule("hide-by-label-height-vertical",(function(t){return {hide:function(e){var n,r;return 0===t.angle(e)?(r=t.h(e),n=Math.abs(t.model.y0(e)-t.model.yi(e))):(r=t.w(e),n=t.model.size(e)),r>n||t.hide(e)}}})).regRule("cut-label-vertical",(function(t){return {h:function(e){var n=t.h(e);if(Math.abs(t.angle(e))>0){var r=Math.abs(t.model.y0(e)-t.model.yi(e));return r<n?r:n}return n},w:function(e){var n=t.w(e);if(0===t.angle(e)){var r=t.model.size(e);return r<n?r:n}return n},label:function(e){var n;return n=0===t.angle(e)?t.model.size(e):Math.abs(t.model.y0(e)-t.model.yi(e)),Br(t.labelLinesAndSeparator(e),n)},dy:function(e){var n=t.dy(e);if(0!==t.angle(e)){var r=t.h(e),i=Math.abs(t.model.y0(e)-t.model.yi(e));return i<r?i*n/r:n}return n}}})).regRule("cut-outer-label-vertical",(function(t){return {h:function(e,n){var r=t.h(e);if(Math.abs(t.angle(e))>0){var i=t.model.y0(e)<t.model.yi(e)?n.maxHeight-t.model.yi(e):t.model.yi(e);return i<r?i:r}return r},w:function(e){var n=t.w(e);if(0===t.angle(e)){var r=t.model.size(e);return r<n?r:n}return n},label:function(e,n){var r;return r=0===t.angle(e)?t.model.size(e):t.model.y0(e)<t.model.yi(e)?n.maxHeight-t.model.yi(e):t.model.yi(e),Br(t.labelLinesAndSeparator(e),r)},dy:function(e,n){var r=t.dy(e);if(0!==t.angle(e)){var i=t.h(e),o=t.model.y0(e)<t.model.yi(e)?n.maxHeight-t.model.yi(e):t.model.yi(e);return o<i?o*r/i:r}return r}}})).regRule("from-beginning",(function(t){var e=function(e){return t.model.y0(e)};return t.model.flip?{x:e}:{y:e}})).regRule("to-end",(function(t){var e=function(e){return t.model.yi(e)};return t.model.flip?{x:e}:{y:e}})).regRule("towards",(function(t){var e=t.model.flip?Gr:qr,n=function(n){return function(t,e){return t.model.yi(e)-t.model.y0(e)>=0?1:-1}(t,n)*e(t,n)};return t.model.flip?{dx:n}:{dy:n}})).regRule("inside-start-then-outside-end-horizontal",(function(t,e){var n=[Ir.getRule("from-beginning"),Ir.getRule("towards"),Ir.getRule("cut-label-horizontal")].reduce((function(t,n){return Rr.compose(t,n(t,e))}),t),r=[Ir.getRule("to-end"),Ir.getRule("towards"),Ir.getRule("cut-outer-label-horizontal")].reduce((function(t,n){return Rr.compose(t,n(t,e))}),t);return Object.assign({},n,["x","dx","hide","label"].reduce((function(t,e){return t[e]=function(t){return (function(t){return n.label(t).length>=r.label(t).length}(t)?n:r)[e](t)},t}),{}))})).regRule("inside-start-then-outside-end-vertical",(function(t,e){var n=[Ir.getRule("from-beginning"),Ir.getRule("towards"),Ir.getRule("cut-label-vertical")].reduce((function(t,n){return Rr.compose(t,n(t,e))}),t),r=[Ir.getRule("to-end"),Ir.getRule("towards"),Ir.getRule("cut-outer-label-vertical")].reduce((function(t,n){return Rr.compose(t,n(t,e))}),t);return Object.assign({},n,["y","dy","hide","label"].reduce((function(t,e){return t[e]=function(t){return (function(t){return n.label(t).length>=r.label(t).length}(t)?n:r)[e](t)},t}),{}))})).regRule("outside-then-inside-horizontal",(function(t,e){var n=["r+","l-","cut-outer-label-horizontal"].map(Ir.getRule).reduce((function(t,n){return Rr.compose(t,n(t,e))}),t),r=["r-","l+","hide-by-label-height-horizontal","cut-label-horizontal"].map(Ir.getRule).reduce((function(t,n){return Rr.compose(t,n(t,e))}),t);return Object.assign({},n,["x","dx","hide","label"].reduce((function(t,e){return t[e]=function(t){return (function(t){return r.label(t).length>n.label(t).length}(t)?r:n)[e](t)},t}),{}))})).regRule("outside-then-inside-vertical",(function(t,e){var n=["t+","b-","cut-outer-label-vertical"].map(Ir.getRule).reduce((function(t,n){return Rr.compose(t,n(t,e))}),t),r=["t-","b+","hide-by-label-height-vertical","cut-label-vertical"].map(Ir.getRule).reduce((function(t,n){return Rr.compose(t,n(t,e))}),t);return Object.assign({},n,["y","dy","hide","label"].reduce((function(t,i){return t[i]=function(t){return (function(t){var r=n.y(t,e)+n.dy(t,e);return r<=0||r>=e.maxHeight}(t)?r:n)[i](t,e)},t}),{}))})).regRule("hide-by-label-height-horizontal",(function(t){return {hide:function(e){return t.model.size(e)<t.h(e)||t.hide(e)}}})).regRule("cut-label-horizontal",(function(t){return {dx:function(e){var n=t.w(e),r=Math.abs(t.model.y0(e)-t.model.yi(e)),i=t.dx(e);return r<n?r*i/n:i},w:function(e){var n=t.w(e),r=Math.abs(t.model.y0(e)-t.model.yi(e));return r<n?r:n},label:function(e){var n=Math.abs(t.model.y0(e)-t.model.yi(e));return Br(t.labelLinesAndSeparator(e),n)}}})).regRule("cut-outer-label-horizontal",(function(t,e){return {dx:function(n){var r=t.w(n),i=t.model.y0(n)<t.model.yi(n)?e.maxWidth-t.model.yi(n):t.model.yi(n),o=t.dx(n);return i<r?i*o/r:o},w:function(n){var r=t.w(n),i=t.model.y0(n)<t.model.yi(n)?e.maxWidth-t.model.yi(n):t.model.yi(n);return i<r?i:r},label:function(n){var r=t.model.y0(n)<t.model.yi(n)?e.maxWidth-t.model.yi(n):t.model.yi(n);return Br(t.labelLinesAndSeparator(n),r)}}})).regRule("keep-within-diameter-or-top",(function(t){return {dy:function(e){return t.model.size(e)/t.w(e)<1?t.dy(e)-t.h(e)/2-t.model.size(e)/2:t.dy(e)}}})).regRule("keep-in-box",(function(t,e){var n=e.maxWidth,r=e.maxHeight;return {dx:function(e){var r=t.dx(e),i=t.x(e)+r,o=t.w(e),a=0-(i-o/2);if(a>0)return r+a;var u=i+o/2-n;return u>0?r-u:r},dy:function(e){var n=t.dy(e),i=t.y(e)+n,o=t.h(e);if(0-(i-o/2)>0)return 0;var a=i+o/2-r;return a>0?n-a:n}}})).regRule("multiline-label-left-align",(function(t){return {dy:function(e){var n=t.dy(e);return -90===t.angle(e)?n+t.h(e)/2:n}}})).regRule("multiline-label-vertical-center-align",(function(t){return {dy:function(e){return t.dy(e)-t.h(e)/2}}})).regRule("multiline-hide-on-container-overflow",(function(t,e){var n=e.maxWidth,r=e.maxHeight;return {hide:function(e){var i=t.angle(e),o=t.x(e)+t.dx(e),a=t.y(e)+t.dy(e);return !(!Yt(o,t.w(e),i,n)&&!Vt(a,t.h(e),i,r))||t.hide(e)}}}));var Vr=function(){function t(t){this.minError=Number.MAX_VALUE,this.items=t.items,this.revision=this.items.map((function(t){return {i:t.i,x:t.x,y:t.y}})),this.penalties=t.penalties,this.transactor=t.transactor,this.cooling_schedule=t.cooling_schedule||function(t,e,n){return t-e/n};}return t.prototype.energy=function(t){return this.penalties.reduce((function(e,n){return e+n(t)}),0)},t.prototype.move=function(t){var e=Math.floor(Math.random()*this.items.length),n=this.transactor(this.items[e]),r=this.energy(e);this.items[e]=n.modify();var i=this.energy(e),o=i-r,a=o<0?1:Math.exp(-o/t);Math.random()>=a?this.items[e]=n.revert():i<this.minError&&(this.minError=i,this.revision=this.items.map((function(t){return {i:t.i,x:t.x,y:t.y}})));},t.prototype.start=function(t){var e=1,n=this.items.length;t:for(var r=0;r<t;r++){for(var i=0;i<n;i++)if(this.move(e),this.minError<=10)break t;e=this.cooling_schedule(e,1,t);}return this.revision},t}(),$r=function(t,e,n,r,i,o,a,u){return Fe(t,i,e,o,n,a,r,u)},Jr={},Kr=function(){function t(){}return t.reg=function(t,e){return Jr[t]=e,this},t.get=function(t){return Jr[t]},t}();Kr.reg("auto:avoid-label-label-overlap",(function(t,e,n){return void 0===n&&(n=1),function(e){var r=t[e].x,i=t[e].y-t[e].h+2,o=t[e].x+t[e].w,a=t[e].y+2;return t.reduce((function(t,u,s){var c=Number(s!==e),l=u.x,f=u.y-u.h+2,d=u.x+u.w,h=u.y+2;return t+c*(Math.max(0,Math.min(d,o)-Math.max(l,r))*Math.max(0,Math.min(h,a)-Math.max(f,i))*n)}),0)}})).reg("auto:avoid-label-anchor-overlap",(function(t,e,n){return void 0===n&&(n=1),function(e){var r=t[e],i=r.x-r.w/2,o=r.x+r.w/2,a=r.y-r.h/2+2,u=r.y+r.h/2+2;return t.reduce((function(t,e){var r=e.x0-e.size/2,s=e.x0+e.size/2,c=e.y0-e.size/2,l=e.y0+e.size/2;return t+Math.max(0,Math.min(s,o)-Math.max(r,i))*Math.max(0,Math.min(l,u)-Math.max(c,a))*n}),0)}})).reg("auto:avoid-label-edges-overlap",(function(t,e,n){return void 0===n&&(n=1),function(r){var i=t[r],o=i.x-i.w/2,a=i.x+i.w/2,u=i.y-i.h/2,s=i.y+i.h/2;return e.reduce((function(t,e){var r=$r(o,a,e.x0,e.x1,u,s,e.y0,e.y1),i=$r(o,a,e.x0,e.x1,s,u,e.y0,e.y1);return t+(Number(r)+Number(i))*n}),0)}}));var Zr=function(t,e,n,r,i,o,a,u){return Fe(t,i,e,o,n,a,r,u)},Qr=function(){function t(t,e,n,r){var i=r.width,o=r.height,a=r.container;this.container=a,this.model=t,this.flip=e,this.w=i,this.h=o,this.guide=te(n||{},{fontFamily:"Helvetica Neue, Segoe UI, Open Sans, Ubuntu, sans-serif",fontWeight:"normal",fontSize:10,fontColor:"#000",hideEqualLabels:!1,lineBreak:!1,lineBreakSeparator:"",position:[],tickFormat:null,tickFormatNullAlias:""});}return t.prototype.draw=function(t){var e=this,n=this.model,r=this.guide,i=r.lineBreak,o=r.lineBreakSeparator,u=Rr.seed(n,{fontColor:r.fontColor,flip:e.flip,formatter:Sn.get(r.tickFormat,r.tickFormatNullAlias),labelRectSize:function(t){return Se(t,r)},lineBreakAvailable:i,lineBreakSeparator:o,paddingKoeff:i?0:.5}),s={lineBreakAvailable:i,maxWidth:e.w,maxHeight:e.h,data:t.reduce((function(t,e){return t.concat(e)}),[])},c=this.applyFixedPositionRules(r,s,u,i,this.flip),l=t.reduce((function(t,e){var n=e.map((function(t){return {data:t,x:c.x(t)+c.dx(t),y:c.y(t)+c.dy(t),w:c.w(t),h:c.h(t,s),hide:c.hide(t),extr:null,size:c.model.size(t),angle:c.angle(t),label:c.label(t),labelLinesAndSeparator:c.labelLinesAndSeparator(t),color:c.color(t)}}));return t.text=t.text.concat(n),t.edges=t.edges.concat(function(t,e){for(var n=t.length-1,r=[],i=0;i<=n;i++){var o=0===i?i:i-1,a=i,u=i===n?i:i+1;r.push(e(t[o],t[a],t[u]));}return r}(n,(function(t,e,n){return e.y===Math.max(e.y,t.y,n.y)?e.extr="min":e.y===Math.min(e.y,t.y,n.y)?e.extr="max":e.extr="norm",{x0:t.x,x1:e.x,y0:t.y,y1:e.y}}))),t}),{text:[],edges:[]});l.text=l.text.filter((function(t){return t.label})).map((function(t,e){return Object.assign(t,{i:e})}));var f=i?["auto:hide-on-label-label-overlap","auto:adjust-on-multiline-label-overflow"]:this.guide.position,d=f.filter((function(t){return 0===t.indexOf("auto:avoid")}));l=l.text.length>0&&d.length>0?this.autoPosition(l,d):l;var h=f.reduce((function(t,e){var n;return Object.assign(t,((n={})[e]=!0,n))}),{});l.text=l.text=h["auto:adjust-on-label-overflow"]?this.adjustOnOverflow(l.text,s):l.text,l.text=l.text=h["auto:adjust-on-multiline-label-overflow"]?this.adjustOnMultilineOverflow(l.text,s):l.text,l.text=h["auto:hide-on-label-edges-overlap"]?this.hideOnLabelEdgesOverlap(l.text,l.edges):l.text,l.text=h["auto:hide-on-label-label-overlap"]?this.hideOnLabelLabelOverlap(l.text):l.text,l.text=h["auto:hide-on-label-anchor-overlap"]?this.hideOnLabelAnchorOverlap(l.text):l.text;var p=l.text,g=function(t){return function(e,n){return p[n][t]}},m=g("x"),y=g("y"),v=g("angle"),b=g("color"),x=g("label"),_=function(t){if(t.style("fill",b).style("font-size",e.guide.fontSize+"px").style("display",(function(t,e){return p[e].hide?"none":null})).attr("class","i-role-label").attr("text-anchor","middle").attr("transform",(function(t,e){return "translate("+m(t,e)+","+y(t,e)+") rotate("+v(t,e)+")"})),i){t.each((function(t,e){var n=a.select(this),r=v(t,e);n.text(null),x(t,e).split(o).forEach((function(t,e){n.append("tspan").attr("text-anchor",0!==r?"start":"middle").attr("x",0).attr("y",0).attr("dy",1.2*(e+1)+"em").text(t);}));}));}else t.text(x);};r.hideEqualLabels&&p.filter((function(t){return !t.hide})).filter((function(t,e,n){return e<n.length-1&&t.label===n[e+1].label})).forEach((function(t){return t.hide=!0}));var w=this.container.selectAll(".i-role-label").data(p.map((function(t){return t.data})));return w.exit().remove(),w.call(_),w.enter().append("text").call(_),w},t.prototype.applyFixedPositionRules=function(t,e,n,r,i){var o=t.position.filter((function(t){return -1===t.indexOf("auto:")}));return r&&(i&&o.push("multiline-label-vertical-center-align"),o.push("multiline-label-left-align","multiline-hide-on-container-overflow")),o.map(Ir.getRule).reduce((function(t,n){return Rr.compose(t,n(t,e))}),n)},t.prototype.autoPosition=function(t,e){var n=function(t,e){var n=4+(t.size+t.w)/2,r=2+(t.size+t.h)/2;return {x:n*Math.cos(e),y:r*Math.sin(e)}},r=t.edges,i=t.text.map((function(t){var e={max:-Math.PI/2,min:Math.PI/2,norm:Math.random()*Math.PI*2},r=n(t,e[t.extr]);return {i:t.i,x0:t.x,y0:t.y,x:t.x+r.x,y:t.y+r.y,w:t.w,h:t.h,size:t.size,hide:t.hide,extr:t.extr}})).filter((function(t){return !t.hide})),o=new Vr({items:i,transactor:function(t){var e=t.x,r=t.y;return {modify:function(){var e={max:-Math.PI,min:Math.PI,norm:2*Math.PI}[t.extr],r=e/4+Math.random()*(2*e)/4,i=n(t,r);return t.x=t.x0+i.x,t.y=t.y0+i.y,t},revert:function(){return t.x=e,t.y=r,t}}},penalties:e.map((function(t){return Kr.get(t)})).filter((function(t){return t})).map((function(t){return t(i,r)}))}).start(5);return t.text=o.reduce((function(t,e){var n=t[e.i];return n.x=e.x,n.y=e.y,t}),t.text),t},t.prototype.hideOnLabelEdgesOverlap=function(t,e){var n=this;return t.filter((function(t){return !t.hide})).forEach((function(t){(function(t,e){var r=n.getLabelRect(t);return e.reduce((function(t,e){var n=Zr(r.x0,r.x1,e.x0,e.x1,r.y0,r.y1,e.y0,e.y1),i=Zr(r.x0,r.x1,e.x0,e.x1,r.y1,r.y0,e.y0,e.y1);return t+2*(Number(n)+Number(i))}),0)})(t,e)>0&&(t.hide=!0);})),t},t.prototype.hideOnLabelLabelOverlap=function(t){var e=this,n={min:0,max:1,norm:2},r={"min/min":function(t,e){return e.y-t.y},"max/max":function(t,e){return t.y-e.y},"min/max":function(){return -1},"min/norm":function(){return -1},"max/norm":function(){return -1},"norm/norm":function(t,e){return t.y-e.y}};return t.filter((function(t){return !t.hide})).sort((function(t,e){return n[t.extr]-n[e.extr]})).forEach((function(i){t.forEach((function(t){i.i!==t.i&&function(t,i){var o=e.getLabelRect(t),a=e.getLabelRect(i),u=Number(!t.hide&&!i.hide);if(u*Math.max(0,Math.min(a.x1,o.x1)-Math.max(o.x0,a.x0))*(u*Math.max(0,Math.min(a.y1,o.y1)-Math.max(o.y0,a.y0)))>0){var s=[t,i];s.sort((function(t,e){return n[t.extr]-n[e.extr]})),(r[s[0].extr+"/"+s[1].extr](s[0],s[1])<0?s[0]:s[1]).hide=!0;}}(i,t);}));})),t},t.prototype.getLabelRect=function(t,e){return void 0===e&&(e=0),{x0:t.x-t.w/2-e,x1:t.x+t.w/2+e,y0:t.y-t.h/2-e,y1:t.y+t.h/2+e}},t.prototype.getPointRect=function(t,e){return void 0===e&&(e=0),{x0:t.x-t.size/2-e,x1:t.x+t.size/2+e,y0:t.y-t.size/2-e,y1:t.y+t.size/2+e}},t.prototype.hideOnLabelAnchorOverlap=function(t){var e=this,n=function(t,n){var r=e.getLabelRect(t,2),i=e.getPointRect(n,2);return Math.max(0,Math.min(i.x1,r.x1)-Math.max(i.x0,r.x0))*Math.max(0,Math.min(i.y1,r.y1)-Math.max(i.y0,r.y0))>.001};return t.filter((function(t){return !t.hide})).forEach((function(e){for(var r=t.length,i=0;i<r;i++){var o=t[i];if(e.i!==o.i&&n(e,o)){e.hide=!0;break}}})),t},t.prototype.adjustOnOverflow=function(t,e){var n=e.maxWidth,r=e.maxHeight;return t.map((function(t){return t.hide||(t.x=Math.min(Math.max(t.x,t.w/2),n-t.w/2),t.y=Math.max(Math.min(t.y,r-t.h/2),t.h/2)),t}))},t.prototype.adjustOnMultilineOverflow=function(t,e){var n=e.maxWidth;return t.map((function(t){return t.hide||0!==t.angle||(t.x=Math.min(Math.max(t.x,t.w/2),n-t.w/2)),t}))},t}(),ti=n(13),ei=function(){return (ei=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},ni=ei({},ti,a),ri={init:function(t){var e=Object.assign({},t);e.guide=te(e.guide||{},{animationSpeed:0,avoidScalesOverflow:!0,enableColorToBarPosition:!1,maxHighlightDistance:32}),e.guide.size=e.guide.size||{},e.guide.label=te(e.guide.label||{},{position:["auto:avoid-label-label-overlap","auto:avoid-label-anchor-overlap","auto:adjust-on-label-overflow","auto:hide-on-label-label-overlap","auto:hide-on-label-anchor-overlap"]});var n=e.guide.avoidScalesOverflow,r=e.guide.enableColorToBarPosition;return e.transformRules=[function(t){var e=[t.scaleX,t.scaleY].sort((function(t,e){var n=t.discrete?1:0;return (e.discrete?1:0)*e.domain().length-n*t.domain().length}))[0];return t.scaleY===e?O.get("flip")(t):O.get("identity")(t)},e.stack&&O.get("stack"),r&&O.get("positioningByColor")].filter((function(t){return t})),e.adjustRules=[e.stack&&O.get("adjustYScale"),function(t,n){var r=t.scaleSize.isEmptyScale(),i=te(e.guide.size,{defMinSize:10,defMaxSize:r?10:40,enableDistributeEvenly:!r}),o=Object.assign({},n,{defMin:i.defMinSize,defMax:i.defMaxSize,minLimit:i.minSize,maxLimit:i.maxSize});return (i.enableDistributeEvenly?O.get("adjustSigmaSizeScale"):O.get("adjustStaticSizeScale"))(t,o)},n&&function(t,e){var n=Object.assign({},e,{sizeDirection:"xy"});return O.get("avoidScalesOverflow")(t,n)}].filter((function(t){return t})),e},addInteraction:function(){var t=this,e=this.node();e.on("highlight",(function(e,n){return t.highlight(n)})),e.on("data-hover",(function(e,n){return t.highlight((r=n.data,i=null,function(t){return t===r||i}));var r,i;}));},draw:function(){var t=this.node(),e=t.config,n=e.options;n.container=n.slot(e.uid);var r=function(t){return it(t,e.guide.animationSpeed)},i=t.screenModel,o={fill:function(t){return i.color(t)},class:function(t){return "tau-chart__dot dot i-role-element i-role-datum "+i.class(t)}},a={r:function(t){return Math.round(1e4*i.size(t)/2)/1e4},cx:function(t){return i.x(t)},cy:function(t){return i.y(t)}},u=[],s=i.toFibers();this._getGroupOrder=function(){var t=s.reduce((function(t,e,n){return t.set(e,n),t}),new Map);return function(e){return t.get(e)}}();var c=n.container.selectAll(".frame").data(s,(function(t){return i.group(t[0])}));c.enter().append("g").attr("opacity",0).merge(c).call((function(e){e.attr("class","frame").call((function(e){var n=e.selectAll("circle").data((function(t){return t}),i.id),s=n.enter().append("circle").call(dt(a)).merge(n).call(dt(o));r(s).call(dt(a)),r(n.exit()).attr("r",0).remove(),u.push.apply(u,s.nodes()),t.subscribe(s);})),r(e).attr("opacity",1);}));this._boundsInfo=this._getBoundsInfo(u),r(c.exit()).attr("opacity",0).remove().selectAll("circle").attr("r",0),t.subscribe(new Qr(i.model,i.flip,e.guide.label,n).draw(s));},_getBoundsInfo:function(t){if(0===t.length)return null;var e=this.node().screenModel,n=t.map((function(t){var n=ni.select(t).data()[0];return {node:t,data:n,x:e.x(n),y:e.y(n),r:e.size(n)/2}})).filter((function(t){return !isNaN(t.x)&&!isNaN(t.y)})),r=n.reduce((function(t,e){var n=e.x,r=e.y;return t.left=Math.min(n,t.left),t.right=Math.max(n,t.right),t.top=Math.min(r,t.top),t.bottom=Math.max(r,t.bottom),t}),{left:Number.MAX_VALUE,right:Number.MIN_VALUE,top:Number.MAX_VALUE,bottom:Number.MIN_VALUE}),i=n.reduce((function(t,e){var n=e.x+","+e.y;return t[n]||(t[n]=[]),t[n].push(e),t}),{});return {bounds:r,tree:ni.quadtree().x((function(t){return t[0].x})).y((function(t){return t[0].y})).addAll(Object.keys(i).map((function(t){return i[t]})))}},getClosestElement:function(t,e){if(!this._boundsInfo)return null;var n=this._boundsInfo,r=n.bounds,i=n.tree,o=ze(this.node().config.options.container.node()),a=t-o.x,u=e-o.y,s=this.node().config.guide.maxHighlightDistance;if(a<r.left-s||a>r.right+s||u<r.top-s||u>r.bottom+s)return null;var c=(i.find(a,u)||[]).map((function(t){var e=Math.sqrt(Math.pow(a-t.x,2)+Math.pow(u-t.y,2));if(e>s)return null;var n=e<t.r?t.r-e:e;return {node:t.node,data:t.data,x:t.x,y:t.y,distance:e,secondaryDistance:n}})).filter((function(t){return t})).sort((function(t,e){return t.secondaryDistance-e.secondaryDistance})),l=c.findIndex((function(t){return t.distance!==c[0].distance||t.secondaryDistance!==c[0].secondaryDistance})),f=l<0?c:c.slice(0,l);if(1===f.length)return f[0];var d=f.reduce((function(t,e){return t+e.x}),0)/f.length,h=f.reduce((function(t,e){return t+e.y}),0)/f.length,p=Math.atan2(h-u,d-a)+Math.PI;return f[Math.round((f.length-1)*p/2/Math.PI)]},highlight:function(t){var e,n=this.node().config.options.container,r=((e={})["tau-chart__highlighted"]=function(e){return !0===t(e)},e["tau-chart__dimmed"]=function(e){return !1===t(e)},e);n.selectAll(".dot").call(ht(r)),n.selectAll(".i-role-label").call(ht(r)),this._sortElements(t);},_sortElements:function(t){var e=this,n=this.node().config.options.container,r=new Map,i=new Map;n.selectAll(".frame").each((function(e){r.set(this,e.some(t)),i.set(this,e);}));var o=re((function(t,e){return r.get(t)-r.get(e)}),(function(t,n){return e._getGroupOrder(i.get(t))-e._getGroupOrder(i.get(n))}));Te(n.node(),(function(t,e){return "g"===t.tagName&&"g"===e.tagName?o(t,e):t.tagName.localeCompare(e.tagName)})),Re(n,".dot",t);}},ii=n(9);function oi(t){return !0!==t.taucharts_synthetic_record}function ai(t){return function(e){var n=t.stack,r=e.scaleX.period,i="linear"===e.scaleY.scaleType,o=!t.guide.x||null==t.guide.x.fillGaps;return !o&&t.guide.x.fillGaps||o&&(n||r&&i)?O.get("fillGaps")(e,{isStack:n,xPeriod:r,utc:t.guide.utcTime}):{}}}function ui(t){if(0===t.length)return "";if(1===t.length)return ci(t[0]);for(var e=[],n=1;n<t.length;n++)e.push(li(t[n-1],t[n]));return e.join(" ")}function si(t){if(0===t.length)return "";if(1===t.length)return ci(t[0]);for(var e=[],n=3;n<t.length;n+=3)e.push(fi(t[n-3],t[n-2],t[n-1],t[n]));return e.join(" ")}function ci(t){var e=t.size/2;return ["M"+t.x+","+(t.y-e),"A"+e+","+e+" 0 0 1",t.x+","+(t.y+e),"A"+e+","+e+" 0 0 1",t.x+","+(t.y-e),"Z"].join(" ")}function li(t,e){var n=vi(t,e);return n?["M"+n.left[0].x+","+n.left[0].y,"L"+n.left[1].x+","+n.left[1].y,"A"+e.size/2+","+e.size/2+" 0 "+Number(t.size<e.size)+" 1",n.right[1].x+","+n.right[1].y,"L"+n.right[0].x+","+n.right[0].y,"A"+t.size/2+","+t.size/2+" 0 "+Number(t.size>e.size)+" 1",n.left[0].x+","+n.left[0].y,"Z"].join(" "):ci(t.size>e.size?t:e)}function fi(t,e,n,r){var i=function(t,e,n,r){var i=pi(t,r);if(0===i||i+t.size/2<=r.size/2||i+r.size/2<=t.size/2)return null;var o=function(i){var o=i?[r,n,e,t]:[t,e,n,r],a=mi.apply(void 0,[1/12*2].concat(o)),u=mi.apply(void 0,[.5].concat(a.slice(0,4))),s=u[3],c=u[6],l=vi(o[0],s),f=vi(s,c),d=[l.left[0],E(.5,l.left[1],f.left[0]),f.left[1]],h=[l.right[0],E(.5,l.right[1],f.right[0]),f.right[1]],p=yi.apply(void 0,d)[1],g=yi.apply(void 0,h)[1],m=E(4,l.left[0],p),y=E(4,l.right[0],g);return {left:i?[y,h[0]]:[d[0],m],right:i?[m,d[0]]:[h[0],y]}},a=o(!1),u=o(!0);return {left:a.left.concat(u.left),right:a.right.concat(u.right)}}(t,e,n,r);if(!i)return li(t,r);var o=hi(di(t,i.right[0]),di(t,i.left[0])),a=hi(di(r,i.right[1]),di(r,i.left[1]));return ["M"+i.left[0].x+","+i.left[0].y,"C"+i.left[1].x+","+i.left[1].y,i.left[2].x+","+i.left[2].y,i.left[3].x+","+i.left[3].y,"A"+r.size/2+","+r.size/2+" 0 "+Number(o>Math.PI)+" 1",i.right[3].x+","+i.right[3].y,"C"+i.right[2].x+","+i.right[2].y,i.right[1].x+","+i.right[1].y,i.right[0].x+","+i.right[0].y,"A"+t.size/2+","+t.size/2+" 0 "+Number(a>Math.PI)+" 1",i.left[0].x+","+i.left[0].y,"Z"].join(" ")}function di(t,e){return Math.atan2(e.y-t.y,e.x-t.x)}function hi(t,e){return e<t&&(e+=2*Math.PI),e-t}function pi(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];for(var n=0,r=1;r<t.length;r++)n+=Math.sqrt((t[r].x-t[r-1].x)*(t[r].x-t[r-1].x)+(t[r].y-t[r-1].y)*(t[r].y-t[r-1].y));return n}function gi(t,e,n){return {x:t.x+e*Math.cos(n),y:t.y+e*Math.sin(n)}}function mi(t,e,n,r,i){var o=C(t,e,n,r,i),a=1/(1+pi(o[3],o[4],o[5],o[6],o[3])/pi(o[0],o[1],o[2],o[3],o[0]));return o[3].size=e.size*(1-a)+i.size*a,o}function yi(t,e,n){var r=E(pi(t,e)/pi(t,e,n),t,n);return [t,E(2,r,e),n]}function vi(t,e){var n=pi(t,e);if(0===n||n+t.size/2<=e.size/2||n+e.size/2<=t.size/2)return null;var r=di(t,e),i=Math.asin((t.size-e.size)/n/2),o=r-Math.PI/2+i,a=r+Math.PI/2-i;return {left:[gi(t,t.size/2,o),gi(e,e.size/2,o)],right:[gi(t,t.size/2,a),gi(e,e.size/2,a)]}}var bi=function(){return (bi=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)};var xi={circle:{element:"circle",getInitialAttrs:function(t,e){var n=t.config.guide,r=t.screenModel;return {r:"hover"===n.showAnchors?0:function(t){return r.size(t)/2},cx:function(t){return e.x(t)},cy:function(t){return e.y(t)}}},getHighlightAttrs:function(t,e,n){t.config.guide;var r=t.screenModel,i="hover"===t.config.guide.showAnchors;return {r:i?function(t){return n(t)?Math.max(4,r.size(t)/2):0}:function(t){var e=r.size(t)/2;return n(t)&&(e=Math.max(4,Math.ceil(1.25*e))),e}}}},"vertical-stick":{element:"path",getInitialAttrs:function(t,e){var n=t.config.guide,r=t.screenModel;return {"shape-rendering":"crispEdges",d:function(t){var i=e.x(t),o=e.y(t),a=e.x0(t),u=e.y0(t),s="hover"===n.showAnchors?0:r.size(t)/2;return ui([{x:i,y:o,size:s},{x:a,y:u,size:s}])}}},getHighlightAttrs:function(t,e,n){t.config.guide;var r=t.screenModel,i="hover"===t.config.guide.showAnchors;return {d:function(t){var o=e.x(t),a=e.y(t),u=e.x0(t),s=e.y0(t),c=i?n(t)?Math.max(4,r.size(t)/2):0:n(t)?Math.max(4,Math.ceil(r.size(t)/2*1.25)):r.size(t)/2;return ui([{x:o,y:a,size:c},{x:u,y:s,size:c}])}}}}};function _i(t,e,n){var r=n.sort((function(t,e){return t.distance===e.distance?t.secondaryDistance-e.secondaryDistance:t.distance-e.distance})),i=r.findIndex((function(t){return t.distance!==r[0].distance||t.secondaryDistance!==r[0].secondaryDistance})),o=i<0?r:r.slice(0,i);if(1===o.length)return o[0];var a=o.reduce((function(t,e){return t+e.x}),0)/o.length,u=o.reduce((function(t,e){return t+e.y}),0)/o.length,s=Math.atan2(u-e,a-t)+Math.PI;return o[Math.round((o.length-1)*s/2/Math.PI)]}var wi="tau-chart__dot-line dot-line i-role-dot i-role-datum tau-chart__dot",Si={init:function(t){var e=t;return e.guide=te(e.guide||{},{animationSpeed:0,cssClass:"",maxHighlightDistance:32,widthCssClass:"",color:{},label:{}}),e.guide.label=te(e.guide.label,{fontSize:11,hideEqualLabels:!0,position:["auto:avoid-label-label-overlap","auto:avoid-label-anchor-overlap","auto:avoid-label-edges-overlap","auto:adjust-on-label-overflow","auto:hide-on-label-label-overlap","auto:hide-on-label-edges-overlap"]}),e.guide.color=te(e.guide.color||{},{fill:null}),["never","hover","always"].indexOf(e.guide.showAnchors)<0&&(e.guide.showAnchors="hover"),e.transformRules=[],e.adjustRules=[],e},baseModel:function(t){var e={gog:t.model,x:t.x,y:t.y,x0:t.x0,y0:t.y0,size:t.size,group:t.group,order:t.order,color:t.color,class:t.class,groupAttributes:{},pathAttributesUpdateInit:{},pathAttributesUpdateDone:{},pathAttributesEnterInit:{},pathAttributesEnterDone:{},pathElement:null,dotAttributes:{r:function(t){return Math.round(1e4*e.size(t)/2)/1e4},cx:function(t){return e.x(t)},cy:function(t){return e.y(t)},fill:function(t){return e.color(t)},class:function(t){return wi+" "+e.class(t)}},dotAttributesDefault:{r:0,cy:function(t){return e.y0(t)}}};return e},addInteraction:function(){var t=this,e=this.node(),n=this.node().config;e.on("highlight",(function(e,n){return t.highlight(n)})),e.on("highlight-data-points",(function(e,n){return t.highlightDataPoints(n)})),"never"!==n.guide.showAnchors&&e.on("data-hover",(function(e,n){return t.highlightDataPoints((r=n.data,i=null,function(t){return t===r||i}));var r,i;}));},draw:function(){var t=this.node(),e=t.config,n=e.guide,r=e.options;r.container=r.slot(e.uid);var i=t.screenModel,o=this.buildModel(i);this.domElementModel=o;var u=ct,s=function(r){r.call(dt(o.groupAttributes));var s,c=r.selectAll((s=wi,s.split(/\s+/g).map((function(t){return "."+t})).join(""))).data((function(t){return t.length<=1?t:[]}),i.id);c.exit().call(u(n.animationSpeed,null,{r:0},(function(t){return a.select(t).remove()}))),c.call(u(n.animationSpeed,null,o.dotAttributes));var l=c.enter().append("circle").call(u(n.animationSpeed,o.dotAttributesDefault,o.dotAttributes)).merge(c);t.subscribe(l);var f=r.selectAll(o.pathElement+":not(.i-data-anchor)").data((function(t){return t.length>1?[t]:[]}),d);f.exit().remove(),f.call(u(n.animationSpeed,o.pathAttributesUpdateInit,o.pathAttributesUpdateDone,o.afterPathUpdate));f.enter().append(o.pathElement).call(u(n.animationSpeed,o.pathAttributesEnterInit,o.pathAttributesEnterDone,o.afterPathUpdate)).merge(f).call((function(t){e.guide.animationSpeed>0&&!document.hidden?(t.attr(o.pathTween.attr,(function(t){return o.pathTween.fn.call(this,t)(0)})),it(t,e.guide.animationSpeed,"pathTransition").attrTween(o.pathTween.attr,o.pathTween.fn)):t.attr(o.pathTween.attr,(function(t){return o.pathTween.fn.call(this,t)(1)}));}));if(t.subscribe(l),"never"!==n.showAnchors){var h=function(t,e,n){var r=e.anchorShape,i=t.config.guide,o=t.screenModel,a=bi({},xi[r].getInitialAttrs(t,e),{opacity:"hover"===i.showAnchors?0:1,fill:function(t){return o.color(t)},class:"i-data-anchor"}),u=n.selectAll(".i-data-anchor").data((function(t){return t.filter(oi)}),o.id);return u.exit().remove(),u.call(ct(i.animationSpeed,null,a)),u.enter().append(xi[e.anchorShape].element).call(ct(i.animationSpeed,{r:0},a)).merge(u)}(t,o,r);t.subscribe(h);}},c=i.toFibers(),l=c.map((function(t){return t.filter(oi)})),f=r.container.selectAll(".frame"),d=function(){var t=f.empty()?[]:f.data(),e=new Map;f.each((function(t){e.set(t,Number(this.getAttribute("data-id")));}));var n=t.reduce((function(t,e){return t.set(e,e.map(i.id)),t}),new Map),r=new Map,o=Math.max.apply(Math,[0].concat(Array.from(e.values())));return function(t){if(r.has(t))return r.get(t);var a,u=t.map((function(t){return i.id(t)})),s=(Array.from(n.entries()).find((function(t){var e=t[1];return u.some((function(t){return e.some((function(e){return e===t}))}))}))||[null])[0];return a=s?e.get(s):++o,r.set(t,a),a}}();this._getDataSetId=d;var h=f.data(c,d);h.exit().remove(),h.call(s),h.enter().append("g").attr("data-id",d).call(s),h.order(),this._boundsInfo=this._getBoundsInfo(r.container.selectAll(".i-data-anchor").nodes()),t.subscribe(new Qr(i.model,e.flip,e.guide.label,r).draw(l));},_getBoundsInfo:function(t){if(0===t.length)return null;var e=this.node().screenModel,n=this.node().config.flip,r=t.map((function(t){var n=a.select(t).data()[0];return {node:t,data:n,x:e.x(n),y:e.y(n)}})).filter((function(t){return !isNaN(t.x)&&!isNaN(t.y)})),i=r.reduce((function(t,e){var n=e.x,r=e.y;return t.left=Math.min(n,t.left),t.right=Math.max(n,t.right),t.top=Math.min(r,t.top),t.bottom=Math.max(r,t.bottom),t}),{left:Number.MAX_VALUE,right:Number.MIN_VALUE,top:Number.MAX_VALUE,bottom:Number.MIN_VALUE}),o=Jt(r.map(n?function(t){return t.y}:function(t){return t.x})).sort((function(t,e){return t-e})),u=o.reduce((function(t,e){return t[e]=[],t}),{});r.forEach((function(t){var e=o.find(n?function(e){return t.y===e}:function(e){return t.x===e});u[e].push(t);}));var s=function(t){if(1===t.length)return u[t[0]];var e=Math.ceil(t.length/2);return {middle:(t[e-1]+t[e])/2,lower:s(t.slice(0,e)),greater:s(t.slice(e))}};return {bounds:i,tree:s(o)}},getClosestElement:function(t,e){if(!this._boundsInfo)return null;var n=this._boundsInfo,r=n.bounds,i=n.tree,o=this.node().config.options.container,a=this.node().config.flip,u=ze(o.node()),s=this.node().config.guide.maxHighlightDistance;if(t<r.left+u.x-s||t>r.right+u.x+s||e<r.top+u.y-s||e>r.bottom+u.y+s)return null;var c=a?e-u.y:t-u.x,l=function t(e){return Array.isArray(e)?e:t(c>e.middle?e.greater:e.lower)}(i).map((function(n){var r=n.x+u.x,i=n.y+u.y,o=Math.abs(a?e-i:t-r),s=Math.abs(a?t-r:e-i);return {node:n.node,data:n.data,distance:o,secondaryDistance:s,x:r,y:i}}));return _i(t,e,l)},highlight:function(t){var e,n,r=this.node().config.options.container,i="tau-chart__highlighted",o="tau-chart__dimmed",a=r.selectAll(".i-role-path"),u=a.data().filter((function(e){return e.filter(oi).some(t)})),s=u.length>0;a.call(ht(((e={})[i]=function(t){return s&&u.indexOf(t)>=0},e[o]=function(t){return s&&u.indexOf(t)<0},e)));var c=((n={})[i]=function(e){return !0===t(e)},n[o]=function(e){return !1===t(e)},n);r.selectAll(".i-role-dot").call(ht(c)),r.selectAll(".i-role-label").call(ht(c)),this._sortElements(t);},highlightDataPoints:function(t){var e=this.node(),n=function(t,e,n){var r=e.anchorShape,i=t.screenModel,o="hover"===t.config.guide.showAnchors;return t.config.options.container.selectAll(".i-data-anchor").call(dt(xi[r].getHighlightAttrs(t,e,n))).attr("opacity",o?function(t){return n(t)?1:0}:function(){return 1}).attr("fill",(function(t){return i.color(t)})).attr("class",(function(t){return Ee("i-data-anchor",i.class(t))})).classed("tau-chart__highlighted",n)}(e,this.domElementModel,t),r=e.config.options.container,i=e.config.flip,o=n.filter(t),a=r.select(".cursor-line");if(o.empty())a.remove();else {a.empty()&&(a=r.append("line"));var u=e.screenModel.model,s=u.xi(o.data()[0]),c=u.xi(o.data()[0]),l=u.scaleY.domain(),f=u.scaleY(l[0]),d=u.scaleY(l[1]);a.attr("class","cursor-line").attr("x1",i?f:s).attr("y1",i?s:f).attr("x2",i?d:c).attr("y2",i?c:d);}this._sortElements(t);},_sortElements:function(t){var e=this.node().config.options.container,n=new Map,r=new Map,i=this._getDataSetId;e.selectAll(".i-role-path").each((function(e){n.set(this,i(e)),r.set(this,e.filter(oi).some(t));}));var o=re((function(t,e){return r.get(t)-r.get(e)}),(function(t,e){return n.get(t)-n.get(e)})),a={line:0,g:1,text:2};Te(e.node(),(function(t,e){return "g"===t.tagName&&"g"===e.tagName?o(t,e):a[t.tagName]-a[e.tagName]}));}},Mi=[1,2,3,4,5],Oi=Mi.map((function(t){return "tau-chart__line-opacity-"+t})),ki=Mi.map((function(t){return "tau-chart__line-width-"+t}));function Ai(t){return Oi[t-1]||Oi[4]}function Ti(t,e){return t.length<2?"":String.prototype.concat.apply("",t.concat(e.slice().reverse()).map((function(t,e){return (0===e?"":" ")+t.x+","+t.y})))}function Ei(t,e){if(t.length<2)return "";var n=function(t){var e=t.map((function(t,e){return ""+((e-1)%3==0?"C":"")+t.x+","+t.y+" "}));return String.prototype.concat.apply("",e)};return "M"+n(t)+"L"+n(e.slice().reverse())+"Z"}var Ci=function(){return (Ci=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},Ni=Ci({},ii,a),Li={draw:Si.draw,highlight:Si.highlight,highlightDataPoints:Si.highlightDataPoints,addInteraction:Si.addInteraction,_sortElements:Si._sortElements,init:function(t){var e=Si.init(t),n=e.stack;return e.transformRules=[e.flip&&O.get("flip"),e.guide.obsoleteVerticalStackOrder&&O.get("obsoleteVerticalStackOrder"),!n&&O.get("groupOrderByAvg"),ai(e),n&&O.get("stack")],e.adjustRules=[function(t,n){var r=t.scaleSize.isEmptyScale(),i=te(e.guide.size||{},{defMinSize:2,defMaxSize:r?6:40}),o=Object.assign({},n,{defMin:i.defMinSize,defMax:i.defMaxSize,minLimit:i.minSize,maxLimit:i.maxSize});return O.get("adjustStaticSizeScale")(t,o)}],e},buildModel:function(t){var e=Si.baseModel(t),n=this.node().config.guide,r="tau-chart__area area i-role-path "+Ai(t.model.scaleColor.domain().length)+" "+n.cssClass+" ";e.groupAttributes={class:function(t){return r+" "+e.class(t[0])+" frame"}};var i={fill:function(t){return e.color(t[0])},stroke:function(t){var n=e.color(t[0]);return n.length>0&&(n=Ni.rgb(n).darker(1)),n}};e.pathAttributesEnterInit=i,e.pathAttributesUpdateDone=i;var o="polyline"===tt(n.interpolate);return e.pathElement=o?"polygon":"path",e.anchorShape="vertical-stick",e.pathTween={attr:o?"points":"d",fn:ft(0,o?Ti:Ei,[function(n){return {id:t.id(n),x:e.x(n),y:e.y(n)}},function(n){return {id:t.id(n),x:e.x0(n),y:e.y0(n)}}],t.id,n.interpolate)},e},_getBoundsInfo:function(t){if(0===t.length)return null;var e,n,r=this.node().screenModel,i=this.node().config.flip,o=t.map((function(t){var e=Ni.select(t).data()[0];return {node:t,data:e,x:r.x(e),y:r.y(e),y0:r.y0(e),group:r.group(e)}})),a=o.reduce((function(t,e){var n=e.x,r=e.y,i=e.y0;return t.left=Math.min(n,t.left),t.right=Math.max(n,t.right),t.top=Math.min(r,i,t.top),t.bottom=Math.max(r,i,t.bottom),t}),{left:Number.MAX_VALUE,right:Number.MIN_VALUE,top:Number.MAX_VALUE,bottom:Number.MIN_VALUE}),u=Jt(o.map(i?function(t){return t.y}:function(t){return t.x})).sort((function(t,e){return t-e})),s=u.reduce((function(t,e){return t[e]=[],t}),{});if(o.forEach((function(t){var e=u.find(i?function(e){return t.y===e}:function(e){return t.x===e});s[e].push(t);})),e=Object.keys(o.reduce((function(t,e){return t[e.group]=!0,t}),{})),n=e.reduce((function(t,e,n){return t[e]=n,t}),{}),u.forEach((function(t){var r=s[t];if(r.sort((function(t,e){return n[t.group]-n[e.group]})),r.length<e.length)for(var i=0;i<e.length;i++){var o=!1,a=void 0,u=void 0;if(i===r.length?(a=u=0===i?0:r[i-1].y,o=!0):r[i].group!==e[i]&&(a=u=r[i].y0,o=!0),o){var c={x:t,y:a,y0:u,data:null,node:null,group:e[i]};r.splice(i,0,c);}}})),1===u.length)return {bounds:a,tree:{start:u[0],end:u[0],isLeaf:!0,items:{start:s[u[0]],end:s[u[0]]}}};var c=function(t){if(2===t.length){var e=t[0],n=t[1];return {start:e,end:n,isLeaf:!0,items:{start:s[e],end:s[n]}}}var r=t.length%2==0?t.length/2:(t.length-1)/2;t[r];return {start:t[0],end:t[t.length-1],isLeaf:!1,left:c(t.slice(0,r+1)),right:c(t.slice(r))}};return {bounds:a,tree:c(u)}},getClosestElement:function(t,e){if(!this._boundsInfo)return null;var n=this._boundsInfo,r=n.bounds,i=n.tree,o=this.node().config.options.container,a=this.node().config.flip,u=ze(o.node()),s=this.node().config.guide.maxHighlightDistance;if(t<r.left+u.x-s||t>r.right+u.x+s||e<r.top+u.y-s||e>r.bottom+u.y+s)return null;var c=a?e-u.y:t-u.x,l=function t(e){if(e.isLeaf)return e;var n=e.left.end;return t(c<n?e.left:e.right)}(i),f=l.end===l.start?0:(c-l.start)/(l.end-l.start);f<0&&(f=0),f>1&&(f=1);var d,h=(d=l.items.start.reduce((function(t,e){return t[e.group]={start:e,end:null,y:null,y0:null},t}),{}),l.items.end.forEach((function(t){void 0!==d[t.group]?d[t.group].end=t:delete d[t.group];})),Object.keys(d).forEach((function(t){var e=d[t];e.end?(e.y=e.start.y+f*(e.end.y-e.start.y),e.y0=e.start.y0+f*(e.end.y0-e.start.y0)):delete d[t];})),Object.keys(d).map((function(t){return d[t]})).map((function(t){return {y:t.y,y0:t.y0,el:f<.5?t.start:t.end}})).filter((function(t){return null!=t.el.data}))),p=e-u.y,g=h.filter((function(t){return p>=t.y&&p<=t.y0})),m=(g.length>0?g:h).map((function(t){return t.el})).map((function(n){var r=n.x+u.x,i=n.y+u.y,o=Math.abs(a?e-i:t-r),s=Math.abs(a?t-r:e-i);return {node:n.node,data:n.data,distance:o,secondaryDistance:s,x:r,y:i}}));return _i(t,e,m)}},ji={draw:Si.draw,getClosestElement:Si.getClosestElement,highlight:Si.highlight,highlightDataPoints:Si.highlightDataPoints,addInteraction:Si.addInteraction,_getBoundsInfo:Si._getBoundsInfo,_sortElements:Si._sortElements,init:function(t){var e=Si.init(t);return e.transformRules=[e.flip&&O.get("flip")],e.adjustRules=[function(t,n){var r=t.scaleSize.isEmptyScale(),i=te(e.guide.size||{},{defMinSize:2,defMaxSize:r?6:40}),o=Object.assign({},n,{defMin:i.defMinSize,defMax:i.defMaxSize,minLimit:i.minSize,maxLimit:i.maxSize});return O.get("adjustStaticSizeScale")(t,o)}],e},buildModel:function(t){var e=Si.baseModel(t),n=this.node().config.guide,r="tau-chart__area area i-role-path "+Ai(t.model.scaleColor.domain().length)+" "+n.cssClass+" ";e.groupAttributes={class:function(t){return r+" "+e.class(t[0])+" frame"}};var i,o,a={fill:function(t){return e.color(t[0])},stroke:function(t){return e.color(t[0])}};return e.pathAttributesEnterInit=a,e.pathAttributesUpdateDone=a,e.pathElement="polygon",e.anchorShape="circle",e.pathTween={attr:"points",fn:ft(0,(i=function(t){return t.x},o=function(t){return t.y},function(t){return t.map((function(t){return [i(t),o(t)].join(",")})).join(" ")}),[function(n){return {id:t.id(n),x:e.x(n),y:e.y(n)}}],t.id)},e}};function Pi(t){if(t.length<2)return "";for(var e="",n=0;n<t.length;n++)e+=(0===n?"M":" L")+t[n].x+","+t[n].y;return e}function Fi(t){if(t.length<4)return "";for(var e="M"+t[0].x+","+t[0].y,n=3;n<t.length;n+=3)e+=" C"+t[n-2].x+","+t[n-2].y+" "+t[n-1].x+","+t[n-1].y+" "+t[n].x+","+t[n].y;return e}var zi={draw:Si.draw,getClosestElement:Si.getClosestElement,highlight:Si.highlight,highlightDataPoints:Si.highlightDataPoints,addInteraction:Si.addInteraction,_getBoundsInfo:Si._getBoundsInfo,_sortElements:Si._sortElements,init:function(t){var e=Si.init(t),n=e.stack;e.guide=te(e.guide||{},{avoidScalesOverflow:!0,interpolate:"linear"}),e.transformRules=[e.flip&&O.get("flip"),!n&&O.get("groupOrderByAvg"),ai(e),n&&O.get("stack")];var r=e.guide.avoidScalesOverflow,i=function(t){return t.scaleSize.isEmptyScale()};return e.adjustRules=[function(t,n){var r=te(e.guide.size||{},{defMinSize:2,defMaxSize:i(t)?6:40}),o=Object.assign({},n,{defMin:r.defMinSize,defMax:r.defMaxSize,minLimit:r.minSize,maxLimit:r.maxSize});return O.get("adjustStaticSizeScale")(t,o)},r&&function(t,e){if(i(t))return function(){return {}};var n=Object.assign({},e,{sizeDirection:"xy"});return O.get("avoidScalesOverflow")(t,n)}].filter((function(t){return t})),e},buildModel:function(t){var e,n,r=this.node().config,i=r.guide,o=r.options,a=!t.model.scaleSize.dim,u=a?"line":"area",s="tau-chart__"+u+" "+u+" i-role-path "+(a?i.widthCssClass||(e=o.width,n=0,e>=160&&e<320?n=1:e>=320&&e<480?n=2:e>=480&&e<640?n=3:e>=640&&(n=4),ki[n]):"")+" "+Ai(t.model.scaleColor.domain().length)+" "+i.cssClass+" ",c=Si.baseModel(t),l=a?{stroke:function(t){return c.color(t[0])},class:"i-role-datum"}:{fill:function(t){return c.color(t[0])}},f="cubic"===tt(i.interpolate)?a?Fi:si:a?Pi:ui,d=a?function(e){return {id:t.id(e),x:c.x(e),y:c.y(e)}}:function(e){return {id:t.id(e),x:c.x(e),y:c.y(e),size:c.size(e)}};return c.groupAttributes={class:function(t){return s+" "+c.class(t[0])+" frame"}},c.pathElement="path",c.anchorShape="circle",c.pathAttributesEnterInit=l,c.pathAttributesUpdateDone=l,c.pathTween={attr:"d",fn:ft(0,f,[d],t.id,i.interpolate)},c}},Ri=function(t){return a.select(t).data()[0]},Di={init:function(t){var e=Object.assign({},t);e.guide=e.guide||{},e.guide=te(e.guide,{animationSpeed:0,avoidScalesOverflow:!0,maxHighlightDistance:32,prettify:!0,sortByBarHeight:!0,enableColorToBarPosition:null!=e.guide.enableColorToBarPosition?e.guide.enableColorToBarPosition:!e.stack}),e.guide.size=te(e.guide.size||{},{enableDistributeEvenly:!0}),e.guide.label=te(e.guide.label||{},{position:e.flip?e.stack?["r-","l+","hide-by-label-height-horizontal","cut-label-horizontal"]:["outside-then-inside-horizontal","auto:hide-on-label-label-overlap"]:e.stack?["rotate-on-size-overflow","t-","b+","hide-by-label-height-vertical","cut-label-vertical","auto:hide-on-label-label-overlap"]:["rotate-on-size-overflow","outside-then-inside-vertical","auto:hide-on-label-label-overlap"]});var n=e.guide.avoidScalesOverflow,r=e.guide.enableColorToBarPosition,i=e.guide.size.enableDistributeEvenly;return e.transformRules=[e.flip&&O.get("flip"),e.guide.obsoleteVerticalStackOrder&&O.get("obsoleteVerticalStackOrder"),e.stack&&O.get("stack"),r&&O.get("positioningByColor")].filter((function(t){return t})),e.adjustRules=[i&&function(t,n){var r=te(e.guide.size||{},{defMinSize:e.guide.prettify?3:0,defMaxSize:e.guide.prettify?40:Number.MAX_VALUE}),i=Object.assign({},n,{defMin:r.defMinSize,defMax:r.defMaxSize,minLimit:r.minSize,maxLimit:r.maxSize});return O.get("size_distribute_evenly")(t,i)},n&&i&&function(t,e){var n=Object.assign({},e,{sizeDirection:"x"});return O.get("avoidScalesOverflow")(t,n)},e.stack&&O.get("adjustYScale")].filter((function(t){return t})),e},addInteraction:function(){var t=this,e=this.node();e.on("highlight",(function(e,n){return t.highlight(n)})),e.on("data-hover",(function(e,n){return t.highlight((r=n.data,i=null,function(t){return t===r||i}));var r,i;}));},draw:function(){var t,e,n=this.node(),r=n.config,i=r.options;i.container=i.slot(r.uid);var o=r.guide.prettify,u=n.screenModel,s=this.buildModel(u,{prettify:o,minBarH:1,minBarW:1,baseCssClass:"i-role-element i-role-datum bar tau-chart__bar"}),c=ct,l=r.flip?"y":"x",f=r.flip?"x":"y",d=r.flip?"width":"height",h=r.flip?"height":"width",p=u.toFibers(),g=p.reduce((function(t,e){return t.concat(e)}),[]),m=s.class,y=ee(s,"class"),v=i.container.selectAll(".bar").data(g,u.id);v.exit().classed("tau-removing",!0).call(c(r.guide.animationSpeed,null,((t={})[l]=function(){var t=a.select(this);return t.attr(l)-0+(t.attr(h)-0)/2},t[f]=function(){return this.getAttribute("data-zero")},t[h]=0,t[d]=0,t),(function(t){var e=a.select(t);e.classed("tau-removing")&&e.remove();}))),v.call(c(r.guide.animationSpeed,null,y));var b=v.enter().append("rect").call(c(r.guide.animationSpeed,(e={},e[f]=u[f+"0"],e[d]=0,e),y)).merge(v).attr("class",m).attr("data-zero",u[f+"0"]);n.subscribe(new Qr(u.model,u.model.flip,r.guide.label,i).draw(p));var x,_=(x=g.reduce((function(t,e,n){return t.set(e,n+1),t}),new Map),function(t,e){return (x.get(Ri(t))||-1)-(x.get(Ri(e))||-1)});this._barsSorter=r.guide.sortByBarHeight?r.flip?function(t,e){var n=Ri(t),r=Ri(e),i=s.width(n),o=s.width(r);if(i===o){var a=s.y(n),u=s.y(r);return a===u?_(t,e):a-u}return o-i}:function(t,e){var n=Ri(t),r=Ri(e),i=s.height(n),o=s.height(r);if(i===o){var a=s.x(n),u=s.x(r);return a===u?_(t,e):a-u}return o-i}:_;var w={rect:0,text:1};this._typeSorter=function(t,e){return w[t.tagName]-w[e.tagName]},this._sortElements(this._typeSorter,this._barsSorter),n.subscribe(b),this._boundsInfo=this._getBoundsInfo(b.nodes());},buildModel:function(t,e){var n,r=e.prettify,i=e.minBarH,o=e.minBarW,a=e.baseCssClass,u=function(e){var n=t.size(e);return r&&(n=Math.max(o,n)),n},s=function(e){return e[t.model.scaleY.dim]};if(t.flip){var c=function(e){return Math.abs(t.x(e)-t.x0(e))};n={y:function(e){return t.y(e)-.5*u(e)},x:function(e){var n=Math.min(t.x0(e),t.x(e));if(r){var o=c(e),a=s(e),u=0;return 0===a&&(u=0),a>0&&(u=o),a<0&&(u=0-i),o<i?n+u:n}return n},height:function(t){return u(t)},width:function(t){var e=c(t);return r?0===s(t)?e:Math.max(i,e):e}};}else {var l=function(e){return Math.abs(t.y(e)-t.y0(e))};n={x:function(e){return t.x(e)-.5*u(e)},y:function(e){var n=Math.min(t.y0(e),t.y(e));r&&(n=l(e)<i&&s(e)>0?n-i:n);return n},width:function(t){return u(t)},height:function(t){var e=l(t);return r&&(e=0===s(t)?e:Math.max(i,e)),e}};}return Object.assign(n,{class:function(e){return a+" "+t.class(e)},fill:function(e){return t.color(e)}})},_sortElements:function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=this.node().config.options.container.node();Te(n,re.apply(r,t));},_getBoundsInfo:function(t){if(0===t.length)return null;var e=this.node().screenModel,n=this.node().config.flip,r=t.map((function(t){var n=a.select(t).data()[0],r=e.x(n),i=e.x0(n),o=e.y(n),u=e.y0(n),s=Math.abs(r-i),c=Math.abs(o-u),l=(r+i)/2,f=(o+u)/2;return {node:t,data:n,cx:l,cy:f,box:{top:f-c/2,right:l+s/2,bottom:f+c/2,left:l-s/2},invert:o>u}})),i=r.reduce((function(t,e){var n=e.box;return t.left=Math.min(n.left,t.left),t.right=Math.max(n.right,t.right),t.top=Math.min(n.top,t.top),t.bottom=Math.max(n.bottom,t.bottom),t}),{left:Number.MAX_VALUE,right:Number.MIN_VALUE,top:Number.MAX_VALUE,bottom:Number.MIN_VALUE}),o=Jt(r.map(n?function(t){return t.cy}:function(t){return t.cx})).sort((function(t,e){return t-e})),u=o.reduce((function(t,e){return t[e]=[],t}),{});r.forEach((function(t){var e=o.find(n?function(e){return t.cy===e}:function(e){return t.cx===e});u[e].push(t);}));var s=function(t){if(1===t.length)return u[t];var e=Math.ceil(t.length/2);return {middle:(t[e-1]+t[e])/2,lower:s(t.slice(0,e)),greater:s(t.slice(e))}};return {bounds:i,tree:s(o)}},getClosestElement:function(t,e){if(!this._boundsInfo)return null;var n=this._boundsInfo,r=n.bounds,i=n.tree,o=this.node().config.options.container,a=this.node().config.flip,u=ze(o.node()),s=t-u.x,c=e-u.y,l=this.node().config.guide.maxHighlightDistance;if(s<r.left-l||s>r.right+l||c<r.top-l||c>r.bottom+l)return null;var f=a?c:s,d=a?s:c;return function t(e){return Array.isArray(e)?e:t(f>e.middle?e.greater:e.lower)}(i).map((function(t){var e,n,r=a?t.box.left:t.box.top,i=a?t.box.right:t.box.bottom,o=(n=i,(e=d)>=r&&e<=n);if(!o&&Math.abs(d-r)>l&&Math.abs(d-i)>l)return null;var u=Math.abs(d-(t.invert!==a?i:r));return Object.assign(t,{distToValue:u,cursorInside:o})})).filter((function(t){return t})).sort((function(t,e){return t.cursorInside!==e.cursorInside?e.cursorInside-t.cursorInside:Math.abs(t.distToValue)-Math.abs(e.distToValue)})).map((function(t){var e=t.cx,n=t.cy,r=Math.abs(a?c-n:s-e),i=Math.abs(a?s-e:c-n);return {node:t.node,data:t.data,distance:r,secondaryDistance:i,x:e,y:n}}))[0]||null},highlight:function(t){var e,n=this.node().config.options.container,r=((e={})["tau-chart__highlighted"]=function(e){return !0===t(e)},e["tau-chart__dimmed"]=function(e){return !1===t(e)},e);n.selectAll(".bar").call(ht(r)),n.selectAll(".i-role-label").call(ht(r)),this._sortElements((function(e,n){return t(Ri(e))-t(Ri(n))}),this._typeSorter,this._barsSorter);}},Ii=n(14),Bi=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),Wi=function(t){function e(e){var n=t.call(this,e)||this;return n.config=e,n.config.guide=te(n.config.guide||{},{}),n.on("highlight",(function(t,e){return n.highlight(e)})),n}return Bi(e,t),e.prototype.defineGrammarModel=function(t){var e=this.config,n=e.options;this.color=t("color",e.color,{}),this.scalesMap=e.columns.reduce((function(e,r){return e[r]=t("pos",r,[0,n.height]),e}),{});var r=n.width/(e.columns.length-1),i=e.columns.reduce((function(t,e,n){return t[e]=n*r,t}),{});return this.xBase=function(t){return i[t]},this.regScale("columns",this.scalesMap).regScale("color",this.color),{}},e.prototype.drawFrames=function(t){var e=this.config,n=this.config.options,r=this.scalesMap,i=this.xBase,o=this.color,a=Ii.line(),u=function(t){t.attr("d",(function(t){return a(e.columns.map((function(e){return [i(e),r[e](t[r[e].dim])]})))}));},s=function(t){t.attr("stroke",(function(t){return o.toColor(o(t[o.dim]))})),t.attr("class",(function(t){return "tau-chart____line line "+o.toClass(o(t[o.dim]))+" foreground"}));},c=function(t){var e=t.selectAll(".background").data((function(t){return t.part()}));e.exit().remove(),e.call(u),e.enter().append("path").attr("class","background line").call(u);var n=t.selectAll(".foreground").data((function(t){return t.part()}));n.exit().remove(),n.call((function(t){u(t),s(t);})),n.enter().append("path").call((function(t){u(t),s(t);}));},l=n.container.selectAll(".lines-frame").data(t,(function(t){return t.hash()}));l.exit().remove(),l.call(c),l.enter().append("g").attr("class","lines-frame").call(c),this.subscribe(n.container.selectAll(".lines-frame .foreground"));},e.prototype.highlight=function(t){this.config.options.container.selectAll(".lines-frame .foreground").style("visibility",(function(e){return t(e)?"":"hidden"}));},e}(m),Hi=function(){function t(t,e){var n,r=this;if(this._fields={},Array.isArray(e.fitToFrameByDims)&&e.fitToFrameByDims.length){n=t.part((function(t){var n={};return "where"===t.type&&t.args?(n.type=t.type,n.args=e.fitToFrameByDims.reduce((function(e,n){return t.args.hasOwnProperty(n)&&(e[n]=t.args[n]),e}),{})):n=t,n}));}else n=t.full();var i=this.getVarSet(n,e);e.order&&(i=Zt(Qt(e.order,i),i)),this.vars=i;var o=i.map((function(t){return t}));this.scaleConfig=e,this.scaleConfig.nice=this.scaleConfig.hasOwnProperty("nice")?this.scaleConfig.nice:this.scaleConfig.autoScale,this.addField("dim",this.scaleConfig.dim).addField("scaleDim",this.scaleConfig.dim).addField("scaleType",this.scaleConfig.type).addField("source",this.scaleConfig.source).addField("domain",(function(){return r.vars})).addField("isInteger",o.every(Number.isInteger)).addField("originalSeries",(function(){return o})).addField("isContains",(function(t){return r.isInDomain(t)})).addField("isEmptyScale",(function(){return r.isEmpty()})).addField("fixup",(function(t){var e=r.scaleConfig;e.__fixup__=e.__fixup__||{},e.__fixup__=Object.assign(e.__fixup__,t(Object.assign({},e,e.__fixup__)));})).addField("commit",(function(){r.scaleConfig=Object.assign(r.scaleConfig,r.scaleConfig.__fixup__),delete r.scaleConfig.__fixup__;}));}return t.prototype.isInDomain=function(t){return this.domain().indexOf(t)>=0},t.prototype.addField=function(t,e){return this._fields[t]=e,this[t]=e,this},t.prototype.getField=function(t){return this._fields[t]},t.prototype.isEmpty=function(){return !Boolean(this._fields.dim)},t.prototype.toBaseScale=function(t,e){var n=this;void 0===e&&(e=null);var r=Object.keys(this._fields).reduce((function(t,e){return t[e]=n._fields[e],t}),t);return r.getHash=function(){return Rt([n.vars,e].map((function(t){return JSON.stringify})).join(""))},r.value=r,r},t.prototype.getVarSet=function(t,e){return Jt(e.hasOwnProperty("series")?e.series:t.map((function(t){return t[e.dim]})),"date"===e.dimType?function(t){return new Date(t).getTime()}:function(t){return t})},t}(),Ui=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),Gi=function(t){function e(e,n){var r=t.call(this,e,n)||this;return r._references=n.references,r._refCounter=n.refCounter,r.addField("scaleType","identity"),r}return Ui(e,t),e.prototype.create=function(){var t=this._references,e=this._refCounter;return this.toBaseScale((function(n,r){if(null==n){var i=t.get(r);null==i&&(i=e(),t.set(r,i));}else i=n;return i}))},e}(Hi),qi=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),Xi=function(){return (Xi=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},Yi=Xi({},u,s),Vi=function(t){function e(e,n){var r=t.call(this,e,n)||this,i="measure"!==n.dimType,o=r.scaleConfig.brewer||(i?Xt(20).map((function(t){return "color20-"+(1+t)})):["#eee","#000"]),a=r.scaleConfig;if(!i){var u=Yi.extent(r.vars),s=function(t){return Number.isFinite(t)||Nt(t)},c=s(a.min)?a.min:u[0],l=s(a.max)?a.max:u[1],f=[c,u[0]].filter(s),d=[l,u[1]].filter(s);if(u=[f.sort((function(t,e){return t-e}))[0],d.sort((function(t,e){return e-t}))[0]],a.nice&&u[0]<0&&u[1]>0){var h=Math.max.apply(Math,u.map(Math.abs));u=[-h,h];}r.vars=u;}return r.addField("scaleType","color").addField("discrete",i).addField("brewer",o).addField("toColor",Ht).addField("toClass",Ut),r}return qi(e,t),e.prototype.create=function(){var t=this.discrete,e=this.vars,n=this.getField("brewer"),r=t?this.createDiscreteScale(e,n):this.createContinuesScale(e,n);return this.toBaseScale(r)},e.prototype.createDiscreteScale=function(t,e){var n,r=function(t,e){var n=t.map((function(t){return String(t).toString()}));return Yi.scaleOrdinal().range(e).domain(n)},i=function(t){return function(e){return t(String(e).toString())}};if(Array.isArray(e))n=i(r(t,e));else if("function"==typeof e)n=function(n){return e(n,i(r(t,Xt(20).map((function(t){return "color20-"+(1+t)})))))};else {if(!Lt(e))throw new Error("This brewer is not supported");n=function(t,e){var n=Object.keys(t),r=n.map((function(e){return t[e]})),i=Yi.scaleOrdinal().range(r).domain(n);return function(n){return t.hasOwnProperty(n)?i(String(n)):e(n)}}(e,(function(){return "color-default"}));}return n},e.prototype.createContinuesScale=function(t,e){if(!Array.isArray(e))throw new Error("This brewer is not supported");return Yi.scaleLinear().domain(Wt(t.map((function(t){return t-0})),e.length)).range(e)},e}(Hi),$i=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),Ji={sqrt:function(t){return Math.sqrt(t)},linear:function(t){return t}},Ki=function(t){function e(e,n){var r=t.call(this,e,n)||this,i=r.scaleConfig,o=u.extent(r.vars),a=Number.isFinite(i.min)?i.min:o[0],s=Number.isFinite(i.max)?i.max:o[1];return r.vars=[Math.min.apply(Math,[a,o[0]].filter(Number.isFinite)),Math.max.apply(Math,[s,o[1]].filter(Number.isFinite))],r.addField("scaleType","size"),r.addField("funcType",n.func||"sqrt"),r}return $i(e,t),e.prototype.isInDomain=function(t){var e=this.domain().sort(),n=e[0],r=e[e.length-1];return !Number.isNaN(n)&&!Number.isNaN(r)&&t<=r&&t>=n},e.prototype.create=function(){var t,e=this.scaleConfig,n=this.vars,r=te({},e,{func:"sqrt",minSize:0,maxSize:1}),i=r.func,o=r.minSize,a=r.maxSize,u=Ji[i],s=n.filter((function(t){return Number.isFinite(Number(t))}));if(0===s.length)t=function(){return a};else {var c,l,f=Math.min.apply(Math,s),d=Math.max.apply(Math,s),h=u(Math.max(Math.abs(f),Math.abs(d),d-f));l=f<0?f:0,c=0===h?1:(a-o)/h,t=function(t){var e=null!==t?parseFloat(t):0;return Number.isFinite(e)?o+u(e-l)*c:a};}return this.toBaseScale(t)},e}(Hi),Zi=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),Qi=function(t){function e(e,n){var r=t.call(this,e,n)||this;return r.addField("scaleType","ordinal").addField("discrete",!0),r}return Zi(e,t),e.prototype.create=function(t){var e=this.scaleConfig,n=this.vars,r=s.scalePoint().domain(n).range(t).padding(.5),i=Math.max.apply(Math,t),o=function(t){return "function"==typeof e.ratio?e.ratio(t,i,n):"object"==typeof e.ratio?e.ratio[t]:1/n.length},a=function(t){return e.ratio?i-n.slice(n.indexOf(t)+1).reduce((function(t,e){return t+i*o(e)}),i*o(t)*.5):r(t)};return Object.keys(r).forEach((function(t){return a[t]=r[t]})),a.stepSize=function(t){return o(t)*i},this.toBaseScale(a,t)},e}(Hi),to=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),eo=function(){return (eo=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},no=eo({},u,s),ro=function(t){function e(e,n){var r=t.call(this,e,n)||this,i=r.scaleConfig,o=r.vars,a=no.extent(o),u=null===i.min||void 0===i.min?a[0]:new Date(i.min).getTime(),s=null===i.max||void 0===i.max?a[1]:new Date(i.max).getTime(),c=[new Date(Math.min(u,a[0])),new Date(Math.max(s,a[1]))],l=x.get(i.period,{utc:i.utcTime});return i.fitToFrameByDims||null===l?r.vars=Jt(o.map((function(t){return new Date(t)})),(function(t){return t.getTime()})).sort((function(t,e){return Number(e)-Number(t)})):r.vars=x.generate(c[0],c[1],i.period,{utc:i.utcTime}),r.periodGenerator=l,r.addField("scaleType","period").addField("utcTime",r.scaleConfig.utcTime).addField("period",r.scaleConfig.period).addField("discrete",!0),r}return to(e,t),e.prototype.isInDomain=function(t){var e=this.periodGenerator,n=new Date(t),r=(e?e.cast(n):n).getTime();return this.domain().map((function(t){return t.getTime()})).indexOf(r)>=0},e.prototype.create=function(t){var e=this.periodGenerator,n=this.vars,r=this.vars.map((function(t){return t.getTime()})),i=this.scaleConfig,o=no.scalePoint().domain(n).range(t).padding(.5),a=no.scalePoint().domain(r.map(String)).range(t).padding(.5),u=Math.max.apply(Math,t),s=function(t){var e=new Date(t).getTime();return "function"==typeof i.ratio?i.ratio(e,u,r):"object"==typeof i.ratio?i.ratio[e]:1/n.length},c=function(t){var n=new Date(t),o=(e?e.cast(n):n).getTime();return i.ratio?u-r.slice(r.indexOf(o)+1).reduce((function(t,e){return t+u*s(e)}),u*s(t)*.5):a(String(o))};return Object.keys(o).forEach((function(t){return c[t]=o[t]})),c.stepSize=function(t){return s(t)*u},this.toBaseScale(c,t)},e}(Hi),io=n(15),oo=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),ao=function(){return (ao=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},uo=ao({},u,s,io),so=function(t){function e(e,n){var r,i=t.call(this,e,n)||this,o=i.scaleConfig,a=i.vars,u=o.period?x.get(i.scaleConfig.period,{utc:o.utcTime}):null,s=uo.extent(a).map(u?function(t){return u.cast(new Date(t))}:function(t){return new Date(t)}),c=null==o.min?s[0]:new Date(o.min).getTime(),l=null==o.max?s[1]:new Date(o.max).getTime();if(a=[new Date(Math.min(c,Number(s[0]))),new Date(Math.max(l,Number(s[1])))],i.niceIntervalFn=null,o.nice&&!u){var f=o.niceInterval,d=f&&co(f)?o.utcTime?uo["utc"+(r=f)[0].toUpperCase()+r.slice(1)]:co(f):null;i.niceIntervalFn=d||null,i.vars=Pt(a,i.niceIntervalFn,{utc:o.utcTime});}else i.vars=a;if(u&&Number(i.vars[0])===Number(i.vars[1])){var h=i.vars[0];i.vars[0]=u.cast(new Date(Number(h)-1)),i.vars[1]=u.next(h);}return i.periodGenerator=u,i.addField("scaleType","time").addField("utcTime",i.scaleConfig.utcTime).addField("period",i.scaleConfig.period),i}return oo(e,t),e.prototype.isInDomain=function(t){var e=new Date(t);this.scaleConfig.period&&(e=this.periodGenerator.cast(e));var n=this.domain(),r=n[0],i=n[n.length-1];return !Number.isNaN(r)&&!Number.isNaN(i)&&e<=i&&e>=r},e.prototype.create=function(t){var e=this,n=this.vars,r=this.scaleConfig.utcTime,i=this.periodGenerator,o=(r?uo.scaleUtc:uo.scaleTime)().domain(n).range(t),a=function(t){var e=n[0],r=n[1];return t>r&&(t=r),t<e&&(t=e),o(new Date(t))};if(this.scaleConfig.period){var u=n[0],s=n[1];o.ticks;o.ticks=function(t){return "number"!=typeof t&&(t=10),function(t,e,n,r){void 0===r&&(r=10);var i=t[0],o=t[1],a=x.get(e,{utc:n}),u=Number(i),s=Number(o),c=Number(a.next(a.cast(i)))-Number(a.cast(i));if((s-u)/c<=r)return x.generate(i,o,e,{utc:n}).filter((function(t){return t>=i&&t<=o}));return function(t,e,n){void 0===n&&(n=10);var r,i,o=Number(t[0]),a=Number(t[1]),u=Math.abs(a-o)/n,s=uo.bisector((function(t){return t.duration})).right(ho,u);if(s===ho.length)r=e?uo.utcYear:uo.timeYear,i=uo.tickStep(o/fo.year.duration,a/fo.year.duration,n);else if(s){var c=u/ho[s-1].duration,l=ho[s].duration/u,f=ho[c<l?s-1:s];r=e?f.time.utc:f.time.interval,i=f.step;}else r=e?uo.utcMillisecond:uo.timeMillisecond,i=uo.tickStep(o,a,n);return r.every(i).range(new Date(o),new Date(a+1))}(t,n,r)}([u,s],e.scaleConfig.period,r,t)};for(var c=i.cast(u);c<u;)c=i.next(c);var l=i.cast(s);a=function(t){var e=i.cast(t);return e<c&&(e=c),e>l&&(e=l),o(e)};}return Object.keys(o).forEach((function(t){return a[t]=o[t]})),a.stepSize=function(){return 0},this.toBaseScale(a,t)},e}(Hi);function co(t){return uo["time"+t[0].toUpperCase()+t.slice(1)]}var lo,fo={second:{duration:1e3,interval:uo.timeSecond,utc:uo.utcSecond},minute:{duration:6e4,interval:uo.timeMinute,utc:uo.utcMinute},hour:{duration:36e5,interval:uo.timeHour,utc:uo.utcHour},day:{duration:864e5,interval:uo.timeDay,utc:uo.utcDay},week:{duration:6048e5,interval:uo.timeWeek,utc:uo.utcWeek},month:{duration:2592e6,interval:uo.timeMonth,utc:uo.utcMonth},year:{duration:31536e6,interval:uo.timeYear,utc:uo.utcYear}},ho=[(lo=function(t,e){return {time:t,step:e,duration:e*t.duration}})(fo.second,1),lo(fo.second,5),lo(fo.second,15),lo(fo.second,30),lo(fo.minute,1),lo(fo.minute,5),lo(fo.minute,15),lo(fo.minute,30),lo(fo.hour,1),lo(fo.hour,3),lo(fo.hour,6),lo(fo.hour,12),lo(fo.day,1),lo(fo.day,2),lo(fo.week,1),lo(fo.month,1),lo(fo.month,3),lo(fo.year,1)];var po=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),go=function(){return (go=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},mo=go({},u,s),yo=function(t){function e(e,n){var r=t.call(this,e,n)||this,i=r.scaleConfig,o=mo.extent(r.vars),a=Number.isFinite(i.min)?i.min:o[0],u=Number.isFinite(i.max)?i.max:o[1];if(o=[Math.min.apply(Math,[a,o[0]].filter(Number.isFinite)),Math.max.apply(Math,[u,o[1]].filter(Number.isFinite))],r.vars=i.nice?jt(o):mo.extent(o),r.vars[0]===r.vars[1]){var s=Math.pow(10,Math.floor(Math.log(r.vars[0])/Math.LN10));r.vars[0]-=s,r.vars[1]+=s||10;}return r.addField("scaleType","linear").addField("discrete",!1),r}return po(e,t),e.prototype.isInDomain=function(t){var e=this.domain(),n=e[0],r=e[e.length-1];return !Number.isNaN(n)&&!Number.isNaN(r)&&t<=r&&t>=n},e.prototype.create=function(t){var e=this.vars,n=this.extendScale(mo.scaleLinear());return n.domain(e).range(t).clamp(!0),this.toBaseScale(n,t)},e.prototype.extendScale=function(t){var e=this,n=t.copy,r=t.ticks;return Object.assign(t,{stepSize:function(){return 0},copy:function(){return e.extendScale(n.call(t))},ticks:this.getField("isInteger")?function(e){return r.call(t,e).filter(Number.isInteger)}:t.ticks}),t},e}(Hi),vo=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),bo=function(){return (bo=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},xo=bo({},u,s),_o=function(t){function e(e,n){var r=t.call(this,e,n)||this,i=r.scaleConfig,o=xo.extent(r.vars),a=Number.isFinite(i.min)?i.min:o[0],u=Number.isFinite(i.max)?i.max:o[1];return So(o=[Math.min.apply(Math,[a,o[0]].filter(Number.isFinite)),Math.max.apply(Math,[u,o[1]].filter(Number.isFinite))]),i.nice&&(o=function(t){var e=t[0]>0,n=t.map((function(t){return Math.abs(t)})),r=Math.max.apply(Math,n),i=Math.min.apply(Math,n).toExponential().split("e"),o=r.toExponential().split("e"),a=parseFloat(Math.floor(Number(i[0]))+"e"+i[1]),u=parseFloat(Math.ceil(Number(o[0]))+"e"+o[1]);return e?[a,u]:[-u,-a]}(o)),r.vars=o,r.addField("scaleType","logarithmic").addField("discrete",!1),r}return vo(e,t),e.prototype.isInDomain=function(t){var e=this.domain(),n=e[0],r=e[e.length-1];return !Number.isNaN(n)&&!Number.isNaN(r)&&t<=r&&t>=n},e.prototype.create=function(t){var e=this.vars;So(e);var n=function t(e){var n=e.copy;return e.ticks=function(t){for(var n=[],r=xo.extent(e.domain()),i=Math.floor(wo(r[0])),o=Math.ceil(wo(r[1])),a=Math.ceil(10*(o-i)/(10*Math.ceil(t/10))),u=i;u<=o;u+=a)for(var s=1;s<=10;s++){var c=Math.pow(s,a)*Math.pow(10,u);(c=parseFloat(c.toExponential(0)))>=r[0]&&c<=r[1]&&n.push(c);}return n},e.copy=function(){var r=n.call(e);return t(r),r},e}(xo.scaleLog()).domain(e).range(t);return n.stepSize=function(){return 0},this.toBaseScale(n,t)},e}(Hi);function wo(t){return Math.log(t)/Math.LN10}function So(t){if(t[0]*t[1]<=0)throw new w("Logarithmic scale domain cannot cross zero.",S.INVALID_LOG_DOMAIN)}var Mo,Oo=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),ko=function(t){function e(e,n){var r=t.call(this,e,n)||this;return r.addField("scaleType","value").addField("georole",n.georole),r}return Oo(e,t),e.prototype.create=function(){return this.toBaseScale((function(t){return t}))},e}(Hi),Ao=function(){var t=function(e,n){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);})(e,n)};return function(e,n){function r(){this.constructor=e;}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}}(),To=function(){return (To=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},Eo=To({},u,s),Co=function(t){function e(e,n){var r=t.call(this,e,n)||this,i=r.scaleConfig,o=Eo.extent(r.vars),a=Number.isFinite(i.min)?i.min:o[0],u=Number.isFinite(i.max)?i.max:o[1];o=[Math.min(a,o[0]),Math.max(u,o[1])],r.vars=i.nice?jt(o):Eo.extent(o);var s=Xt(10).map((function(t){return "rgba(90,180,90,"+(.2+t*(.8/9)).toFixed(2)+")"})),c=i.brewer||s;return r.addField("scaleType","fill").addField("brewer",c),r}return Ao(e,t),e.prototype.isInDomain=function(t){var e=this.domain(),n=e[0],r=e[e.length-1];return !Number.isNaN(n)&&!Number.isNaN(r)&&t<=r&&t>=n},e.prototype.create=function(){var t=this.vars,e=this.getField("brewer");if(!Array.isArray(e))throw new Error("This brewer is not supported");var n=e.length,r=(t[1]-t[0])/n,i=Xt(n-1).map((function(t){return t+1})).reduce((function(e,n){return e.concat([t[0]+n*r])}),[]),o=Eo.scaleThreshold().domain(i).range(e);return this.toBaseScale(o)},e}(Hi),No=function(t){return t||null},Lo=function(t,e){return void 0===e&&(e=null),Array.isArray(t)?0===t.length?[e]:t:[t]},jo=function(t,e){return {type:t,x:e.x,y:e.y,identity:e.identity,size:e.size,color:e.color,split:e.split,label:e.label,guide:{color:e.colorGuide,obsoleteVerticalStackOrder:e.obsoleteVerticalStackOrder,size:e.sizeGuide},flip:e.flip,stack:e.stack}},Po="SUCCESS",Fo="WARNING",zo="FAIL",Ro=((Mo={})[Po]=function(t){return t},Mo[zo]=function(t,e){throw new Error((e.messages||[]).join("\n")||["This configuration is not supported,","See https://api.taucharts.com/basic/facet.html#easy-approach-for-creating-facet-chart"].join(" "))},Mo[Fo]=function(t,e,n){var r=e.axis,i=e.indexMeasureAxis[0],o=t[i],a=t.filter((function(t){return t!==o}));a.push(o);var u=n[i][r]||{},s=n[n.length-1][r]||{};return n[n.length-1][r]=u,n[i][r]=s,a},Mo);function Do(t,e,n){return e.reduce((function(e,r,i){var o=t[r];return o?e.status!=zo&&("measure"===o.type&&(e.countMeasureAxis++,e.indexMeasureAxis.push(i)),"measure"!==o.type&&1===e.countMeasureAxis?e.status=Fo:e.countMeasureAxis>1&&(e.status=zo,e.messages.push('There is more than one measure dimension for "'+n+'" axis'))):(e.status=zo,r?e.messages.push('"'+r+'" dimension is undefined for "'+n+'" axis'):e.messages.push('"'+n+'" axis should be specified')),e}),{status:Po,countMeasureAxis:0,indexMeasureAxis:[],messages:[],axis:n})}function Io(t){for(var e=Lo(t.x),n=Lo(t.y),r=Math.max(e.length,n.length),i=Lo(t.guide||{},{}),o=r-i.length,a=0;a<o;a++)i.push({});i=i.slice(0,r);var u=Do(t.dimensions,e,"x"),s=Do(t.dimensions,n,"y");e=Ro[u.status](e,u,i),n=Ro[s.status](n,s,i);var c=["identity","color","size","label","split"].reduce((function(e,n){var r=t[n],i=function(t,e,n){return null==e?e:String(e)}(t.dimensions,r);return null!=i&&(e[n]=i),e}),{});return Object.assign({},t,{x:e,y:n,guide:i},c)}function Bo(t,e){for(var n=e.x,r=e.y,i=e.guide,o=Math.max(n.length,r.length),a={type:"COORDS.RECT",unit:[]},u=[].concat(n),s=[].concat(r),c=[].concat(i),l=o;l>0;l--){var f=u.pop(),d=s.pop(),h=c.pop()||{};l===o?(a.x=f,a.y=d,a.unit.push(jo(t,{x:No(f),y:No(d),identity:e.identity,split:e.split,color:e.color,label:e.label,size:e.size,flip:e.flip,stack:e.stack,colorGuide:h.color,obsoleteVerticalStackOrder:h.obsoleteVerticalStackOrder,sizeGuide:h.size})),a.guide=te(h,{x:{label:f},y:{label:d}})):a={type:"COORDS.RECT",x:No(f),y:No(d),unit:[a],guide:te(h,{x:{label:f},y:{label:d}})};}return e.spec={dimensions:e.dimensions,unit:a},e}var Wo=function(t){var e,n,r,i=Io(t);return n=((e=i).flip?e.y:e.x).indexOf(e.color)>=0,r=e.guide[e.guide.length-1],n&&!r.hasOwnProperty("enableColorToBarPosition")&&(r.enableColorToBarPosition=!1),Bo("ELEMENT.INTERVAL",i=e)},Ho=function(t){var e=Io(t),n=e.data,r=e.settings.log,i=(0,{horizontal:function(t){return {prop:t.x[t.x.length-1],flip:!1}},vertical:function(t){return {prop:t.y[t.y.length-1],flip:!0}},auto:function(t){var e,i=t.x,o=t.y,a=i[i.length-1],u=i.slice(0,i.length-1),s=o[o.length-1],c=o.slice(0,o.length-1),l=t.color,f=u.concat(c).concat([l]).filter((function(t){return null!==t})),d=-1,h=[[[a].concat(f),s],[[s].concat(f),a]],p=null;return h.some((function(t,e){var i=t[0],o=t[1],a=un(n,i,[o]);return a.result?d=e:r(["Attempt to find a functional relation between",t[0]+" and "+t[1]+" is failed.","There are several "+a.error.keyY+" values (e.g. "+a.error.errY.join(",")+")","for ("+a.error.keyX+" = "+a.error.valX+")."].join(" ")),a.result}))?(e=h[d][0][0],p=0!==d):(r("All attempts are failed. Gonna transform AREA to general PATH."),e=null),{prop:e,flip:p}}}["boolean"!=typeof e.flip?"auto":e.flip?"vertical":"horizontal"])(e);return null!==i.prop&&(e.data=fn(n,i.prop,e.dimensions[i.prop]),e.flip=i.flip),Bo("ELEMENT.AREA",e)},Uo=function(){function t(t){this.unitRef=t;}return t.prototype.value=function(){return this.unitRef},t.prototype.clone=function(){return JSON.parse(JSON.stringify(this.unitRef))},t.prototype.traverse=function(t){var e=function(t,n,r){n(t,r),(t.units||[]).map((function(r){return e(r,n,t)}));};return e(this.unitRef,t,null),this},t.prototype.reduce=function(t,e){var n=e;return this.traverse((function(e,r){return n=t(n,e,r)})),n},t.prototype.addFrame=function(t){return this.unitRef.frames=this.unitRef.frames||[],t.key.__layerid__=["L",(new Date).getTime(),this.unitRef.frames.length].join(""),t.source=t.hasOwnProperty("source")?t.source:this.unitRef.expression.source,t.pipe=t.pipe||[],this.unitRef.frames.push(t),this},t.prototype.addTransformation=function(t,e){return this.unitRef.transformation=this.unitRef.transformation||[],this.unitRef.transformation.push({type:t,args:e}),this},t.prototype.isCoordinates=function(){return 0===(this.unitRef.type||"").toUpperCase().indexOf("COORDS.")},t.prototype.isElementOf=function(t){if(this.isCoordinates())return !1;var e=(this.unitRef.type||"").split("/");return 1===e.length&&e.unshift("RECT"),e[0].toUpperCase()===t.toUpperCase()},t}(),Go=function(){function t(t){this.specRef=t;}return t.prototype.value=function(){return this.specRef},t.prototype.unit=function(t){return t&&(this.specRef.unit=t),new Uo(this.specRef.unit)},t.prototype.addTransformation=function(t,e){return this.specRef.transformations=this.specRef.transformations||{},this.specRef.transformations[t]=e,this},t.prototype.getSettings=function(t){return this.specRef.settings[t]},t.prototype.setSettings=function(t,e){return this.specRef.settings=this.specRef.settings||{},this.specRef.settings[t]=e,this},t.prototype.getScale=function(t){return this.specRef.scales[t]},t.prototype.addScale=function(t,e){return this.specRef.scales[t]=e,this},t.prototype.regSource=function(t,e){return this.specRef.sources[t]=e,this},t.prototype.getSourceData=function(t){return (this.specRef.sources[t]||{data:[]}).data},t.prototype.getSourceDim=function(t,e){return (this.specRef.sources[t]||{dims:{}}).dims[e]||{}},t}(),qo={},Xo=function(){function t(){}return t.unit=function(t){return new Uo(t)},t.spec=function(t){return new Go(t)},t.cloneObject=function(t){return JSON.parse(JSON.stringify(t))},t.depthFirstSearch=function(e,n){if(n(e))return e;for(var r=e.hasOwnProperty("frames")?e.frames:[{units:e.units}],i=0;i<r.length;i++)for(var o=r[i].units||[],a=0;a<o.length;a++){var u=t.depthFirstSearch(o[a],n);if(u)return u}},t.traverseSpec=function(t,e){var n=function(t,e,r){e(t,r),(t.units||[]).map((function(r){return n(r,e,t)}));};n(t.unit,e,null);},t.extractFieldsFormatInfo=function(e){var n=e.scales,r=function(t){return !n[t].dim},i=function(t,e,r){var i=e.guide||{},o=n[e[r]],a=i[r]||{};t[o.dim]=t[o.dim]||{label:[],format:[],nullAlias:[],tickLabel:[]};var u=a.label,s=a.label||{};t[o.dim].label.push("string"==typeof u?u:s._original_text||s.text);var c=a.tickFormat||a.tickPeriod;t[o.dim].format.push(c),t[o.dim].nullAlias.push(a.tickFormatNullAlias),t[o.dim].tickLabel.push(a.tickLabel);},o=[];t.traverseSpec(e,(function(t){o.push(t);}));var a=o.reduce((function(t,e){return "COORDS.RECT"===e.type&&e.hasOwnProperty("x")&&!r(e.x)&&i(t,e,"x"),"COORDS.RECT"===e.type&&e.hasOwnProperty("y")&&!r(e.y)&&i(t,e,"y"),e.hasOwnProperty("color")&&!r(e.color)&&i(t,e,"color"),e.hasOwnProperty("size")&&!r(e.size)&&i(t,e,"size"),e.hasOwnProperty("label")&&!r(e.label)&&i(t,e,"label"),t}),{}),u=function(t,e){return t.filter((function(t){return t}))[0]||e};return Object.keys(a).reduce((function(t,n){t[n]={},t[n].label=u(a[n].label,n);var r=u(a[n].format,null);t[n].nullAlias=u(a[n].nullAlias,"No "+t[n].label),t[n].tickLabel=u(a[n].tickLabel,null);var i="x-time-auto"===r?e.settings.utcTime?"day-utc":"day":r,o=t[n].nullAlias,s=i?Sn.get(i,o):function(t){return null==t?o:String(t)};if(t[n].format=s,t[n].tickLabel){var c=n.replace("."+t[n].tickLabel,"");t[c]={label:t[n].label,nullAlias:t[n].nullAlias,tickLabel:t[n].tickLabel,format:function(e){return s(e&&e[t[c].tickLabel])},isComplexField:!0},t[n].parentField=c;}return t}),{})},t.getFieldFormatters=function(e,n){var r=t.extractFieldsFormatInfo(e);Object.keys(r).forEach((function(t){r[t].parentField&&delete r[t];}));return Object.keys(n).forEach((function(t){var e,i,o=(e=n[t],i={},"function"==typeof e||"string"==typeof e?i={format:e}:Lt(e)&&(i=ie(e,"label","format","nullAlias")),i);r[t]=Object.assign({label:t,nullAlias:"No "+t},r[t]||{},ie(o,"label","nullAlias")),o.hasOwnProperty("format")?r[t].format="function"==typeof o.format?o.format:Sn.get(o.format,r[t].nullAlias):r[t].format=r[t].hasOwnProperty("format")?r[t].format:Sn.get(null,r[t].nullAlias);})),Object.keys(r).reduce((function(t,e){var n=r[e];return t[e]={label:n.label,format:n.format},t}),{})},t.tokens=function(){return {reg:function(t,e){return qo[t]=e,this},get:function(t){return qo[t]||t}}},t.getParentUnit=function(t,e){var n=null,r=function(t,i){return t.uid===e.uid?(n=i,!0):(t.frames?t.frames.some((function(e){return (e.units||[]).some((function(e){return r(e,t)}))})):(t.units||[]).some((function(e){return r(e,t)})),!1)};return r(t.unit,null),n},t}();n(16);n.d(e,"api",(function(){return $o})),n.d(e,"version",(function(){return Ko})),n.d(e,"GPL",(function(){return Ge})),n.d(e,"Plot",(function(){return ir})),n.d(e,"Chart",(function(){return lr}));var Yo={},Vo={},$o={errorCodes:S,unitsRegistry:en,scalesRegistry:on,grammarRegistry:O,tickFormat:Sn,isChartElement:de,utils:r,svgUtils:o,domUtils:i,tickPeriod:x,colorBrewers:{add:function(t,e){Yo.hasOwnProperty(t)||(Yo[t]=e);},get:function(t){return Yo[t]}},d3_animationInterceptor:ct,pluginsSDK:Xo,plugins:{add:function(t,e){if(Vo.hasOwnProperty(t))throw new Error("Plugin is already registered.");Vo[t]=e;},get:function(t){return Vo[t]||function(e){throw new Error('"'+t+'" plugin is not defined')}}},chartTypesRegistry:sr,globalSettings:{animationSpeed:750,renderingTimeout:1e4,asyncRendering:!0,syncRenderingInterval:50,syncPointerEvents:!1,handleRenderingErrors:!1,experimentalShouldAnimate:function(t){var e=function(t,e){var n=document.createElementNS("http://www.w3.org/2000/svg",t);return Object.keys(e).forEach((function(t){return n.setAttribute(t,String(e[t]))})),n},n=document.createElement("div");n.style.position="absolute",n.style.visibility="hidden",document.body.appendChild(n);var r=e("svg",{width:100,height:100});n.appendChild(r);var i,o,a,u=performance.now();for(i=0;i<10;i++)for(o=0;o<10;o++)a=e("circle",{fill:"black",r:5,cx:10*i,cy:10*o}),r.appendChild(a);var s=performance.now()-u;return document.body.removeChild(n),t.sources["/"].data.length*s<500},defaultNiceColor:!0,defaultColorBrewer:["#fde725","#fbe723","#f8e621","#f6e620","#f4e61e","#f1e51d","#efe51c","#ece51b","#eae51a","#e7e419","#e5e419","#e2e418","#dfe318","#dde318","#dae319","#d8e219","#d5e21a","#d2e21b","#d0e11c","#cde11d","#cae11f","#c8e020","#c5e021","#c2df23","#c0df25","#bddf26","#bade28","#b8de29","#b5de2b","#b2dd2d","#b0dd2f","#addc30","#aadc32","#a8db34","#a5db36","#a2da37","#a0da39","#9dd93b","#9bd93c","#98d83e","#95d840","#93d741","#90d743","#8ed645","#8bd646","#89d548","#86d549","#84d44b","#81d34d","#7fd34e","#7cd250","#7ad151","#77d153","#75d054","#73d056","#70cf57","#6ece58","#6ccd5a","#69cd5b","#67cc5c","#65cb5e","#63cb5f","#60ca60","#5ec962","#5cc863","#5ac864","#58c765","#56c667","#54c568","#52c569","#50c46a","#4ec36b","#4cc26c","#4ac16d","#48c16e","#46c06f","#44bf70","#42be71","#40bd72","#3fbc73","#3dbc74","#3bbb75","#3aba76","#38b977","#37b878","#35b779","#34b679","#32b67a","#31b57b","#2fb47c","#2eb37c","#2db27d","#2cb17e","#2ab07f","#29af7f","#28ae80","#27ad81","#26ad81","#25ac82","#25ab82","#24aa83","#23a983","#22a884","#22a785","#21a685","#21a585","#20a486","#20a386","#1fa287","#1fa187","#1fa188","#1fa088","#1f9f88","#1f9e89","#1e9d89","#1e9c89","#1e9b8a","#1f9a8a","#1f998a","#1f988b","#1f978b","#1f968b","#1f958b","#1f948c","#20938c","#20928c","#20928c","#21918c","#21908d","#218f8d","#218e8d","#228d8d","#228c8d","#228b8d","#238a8d","#23898e","#23888e","#24878e","#24868e","#25858e","#25848e","#25838e","#26828e","#26828e","#26818e","#27808e","#277f8e","#277e8e","#287d8e","#287c8e","#297b8e","#297a8e","#29798e","#2a788e","#2a778e","#2a768e","#2b758e","#2b748e","#2c738e","#2c728e","#2c718e","#2d718e","#2d708e","#2e6f8e","#2e6e8e","#2e6d8e","#2f6c8e","#2f6b8e","#306a8e","#30698e","#31688e","#31678e","#31668e","#32658e","#32648e","#33638d","#33628d","#34618d","#34608d","#355f8d","#355e8d","#365d8d","#365c8d","#375b8d","#375a8c","#38598c","#38588c","#39568c","#39558c","#3a548c","#3a538b","#3b528b","#3b518b","#3c508b","#3c4f8a","#3d4e8a","#3d4d8a","#3e4c8a","#3e4a89","#3e4989","#3f4889","#3f4788","#404688","#404588","#414487","#414287","#424186","#424086","#423f85","#433e85","#433d84","#443b84","#443a83","#443983","#453882","#453781","#453581","#463480","#46337f","#46327e","#46307e","#472f7d","#472e7c","#472d7b","#472c7a","#472a7a","#482979","#482878","#482677","#482576","#482475","#482374","#482173","#482071","#481f70","#481d6f","#481c6e","#481b6d","#481a6c","#48186a","#481769","#481668","#481467","#471365","#471164","#471063","#470e61","#470d60","#460b5e","#460a5d","#46085c","#46075a","#450559","#450457","#440256","#440154"],defaultClassBrewer:Xt(20).map((function(t){return "color20-"+(1+t)})),log:function(t,e){e=e||"INFO",Array.isArray(t)||(t=[t]),console[e.toLowerCase()].apply(console,t);},facetLabelDelimiter:" → ",excludeNull:!0,minChartWidth:300,minChartHeight:200,minFacetWidth:150,minFacetHeight:100,specEngine:[{name:"COMPACT",width:600,height:400},{name:"AUTO",width:Number.MAX_VALUE,height:Number.MAX_VALUE}],fitModel:"normal",layoutEngine:"EXTRACT",autoRatio:!0,defaultSourceMap:["https://raw.githubusercontent.com","TargetProcess/tauCharts/master/src/addons","world-countries.json"].join("/"),getAxisTickLabelSize:ne(we,(function(t){return String(String(t).length)})),getScrollbarSize:ye,avoidScrollAtRatio:1.5,xAxisTickLabelLimit:150,yAxisTickLabelLimit:150,xTickWordWrapLinesLimit:2,yTickWordWrapLinesLimit:2,xTickWidth:9,yTickWidth:9,distToXAxisLabel:10,distToYAxisLabel:10,xAxisPadding:20,yAxisPadding:20,xFontLabelDescenderLineHeight:4,xFontLabelHeight:10,yFontLabelHeight:10,xDensityPadding:2,yDensityPadding:2,"xDensityPadding:measure":8,"yDensityPadding:measure":8,utcTime:!1,defaultFormats:{measure:"x-num-auto","measure:time":"x-time-auto"}}};ir.__api__=$o,ir.globalSettings=$o.globalSettings,$o.unitsRegistry.reg("COORDS.RECT",_r).reg("COORDS.MAP",Fr).reg("COORDS.PARALLEL",Ar).reg("ELEMENT.GENERIC.CARTESIAN",gt).reg("ELEMENT.POINT",ri,"ELEMENT.GENERIC.CARTESIAN").reg("ELEMENT.LINE",zi,"ELEMENT.GENERIC.CARTESIAN").reg("ELEMENT.PATH",ji,"ELEMENT.GENERIC.CARTESIAN").reg("ELEMENT.AREA",Li,"ELEMENT.GENERIC.CARTESIAN").reg("ELEMENT.INTERVAL",Di,"ELEMENT.GENERIC.CARTESIAN").reg("ELEMENT.INTERVAL.STACKED",Di,"ELEMENT.GENERIC.CARTESIAN").reg("ELEMENT.INTERVAL.STACKED",Di,"ELEMENT.GENERIC.CARTESIAN").reg("PARALLEL/ELEMENT.LINE",Wi),$o.scalesRegistry.reg("identity",Gi,(function(t,e){return te(t,{references:e.references,refCounter:e.refCounter})})).reg("color",Vi,(function(t,e){return te(t,{nice:e.defaultNiceColor,brewer:"measure"===t.dimType?e.defaultColorBrewer:e.defaultClassBrewer})})).reg("fill",Co).reg("size",Ki).reg("ordinal",Qi).reg("period",ro,(function(t,e){return te(t,{utcTime:e.utcTime})})).reg("time",so,(function(t,e){return te(t,{utcTime:e.utcTime})})).reg("linear",yo).reg("logarithmic",_o).reg("value",ko);var Jo=[function(t){return t.data?[]:["[data] must be specified"]}];$o.chartTypesRegistry.add("scatterplot",(function(t){return Bo("ELEMENT.POINT",Io(t))}),Jo).add("line",(function(t){var e=Io(t),n=e.data,r=e.settings.log,i={none:function(){return null},horizontal:function(t){return t.x[t.x.length-1]},vertical:function(t){return t.y[t.y.length-1]},auto:function(t){var e,i=t.x,o=t.y,a=i[i.length-1],u=i.slice(0,i.length-1),s=o[o.length-1],c=o.slice(0,o.length-1),l=t.color,f=u.concat(c).concat([l]).filter((function(t){return null!==t})),d=-1,h=[[[a].concat(f),s],[[s].concat(f),a]];return h.some((function(t,e){var i=t[0],o=t[1],a=un(n,i,[o]);return a.result?d=e:r(["Attempt to find a functional relation between",t[0]+" and "+t[1]+" is failed.","There are several "+a.error.keyY+" values (e.g. "+a.error.errY.join(",")+")","for ("+a.error.keyX+" = "+a.error.valX+")."].join(" ")),a.result}))?e=h[d][0][0]:(r(["All attempts are failed.","Will orient line horizontally by default.","NOTE: the [scatterplot] chart is more convenient for that data."].join(" ")),e=a),e}},o=(e.lineOrientation||"").toLowerCase(),a=(i.hasOwnProperty(o)?i[o]:i.auto)(e);return null!==a&&(e.data=fn(n,a,e.dimensions[a])),Bo("ELEMENT.LINE",e)}),Jo).add("area",Ho,Jo).add("stacked-area",(function(t){return Ho(te(t,{stack:!0}))}),Jo).add("bar",(function(t){return Wo(te(t,{flip:!1}))}),Jo).add("horizontalBar",(function(t){return Wo(te({flip:!0},t))}),Jo).add("horizontal-bar",(function(t){return Wo(te({flip:!0},t))}),Jo).add("stacked-bar",(function(t){return Wo(te({flip:!1,stack:!0},t))}),Jo).add("horizontal-stacked-bar",(function(t){return Wo(te({flip:!0,stack:!0},t))}),Jo).add("map",(function(t){var e=Object.assign({sourcemap:t.settings.defaultSourceMap},t.guide||{});e.size=te(e.size||{},{min:1,max:10}),e.code=te(e.code||{},{georole:"countries"});var n={},r=function(t,e,r){var i;void 0===r&&(r={});var o,a=e;return e?(i=t+"_"+e,o="/"):(i=t+":default",o="?"),n.hasOwnProperty(i)||(n[i]=Object.assign({type:t,source:o,dim:a},r)),i};return {sources:{"?":{dims:{},data:[{}]},"/":{dims:Object.keys(t.dimensions).reduce((function(e,n){return e[n]={type:t.dimensions[n].type},e}),{}),data:t.data}},scales:n,unit:{type:"COORDS.MAP",expression:{operator:"none",source:"/"},code:r("value",t.code,e.code),fill:r("fill",t.fill,e.fill),size:r("size",t.size,e.size),color:r("color",t.color,e.color),latitude:r("linear",t.latitude,{nice:!1}),longitude:r("linear",t.longitude,{nice:!1}),guide:e},plugins:t.plugins||[]}}),Jo.concat([function(t){var e=t.fill&&t.code;if(t.fill&&!e)return "[code] must be specified when using [fill]"},function(t){var e=t.latitude&&t.longitude;if((t.latitude||t.longitude)&&!e)return "[latitude] and [longitude] both must be specified"}])).add("parallel",(function(t){var e=Object.assign({columns:{}},t.guide||{}),n={},r=function(t,e,r){var i;void 0===r&&(r={});var o,a=e;return e?(i=t+"_"+e,o="/"):(i=t+":default",o="?"),n.hasOwnProperty(i)||(n[i]=Object.assign({type:t,source:o,dim:a},r)),i},i=t.columns.map((function(n){return r(t.dimensions[n].scale,n,e.columns[n])}));return {sources:{"?":{dims:{},data:[{}]},"/":{dims:Object.keys(t.dimensions).reduce((function(e,n){return e[n]={type:t.dimensions[n].type},e}),{}),data:t.data}},scales:n,unit:{type:"COORDS.PARALLEL",expression:{operator:"none",source:"/"},columns:i,guide:e,units:[{type:"PARALLEL/ELEMENT.LINE",color:r("color",t.color,e.color),columns:i,expression:{operator:"none",source:"/"}}]},plugins:t.plugins||[]}}),Jo.concat([function(t){if(!(t.columns&&t.columns.length>1))return "[columns] property must contain at least 2 dimensions"}]));var Ko="2.8.0";e.default={GPL:Ge,Plot:ir,Chart:lr,api:$o,version:"2.8.0"};},function(t,n){t.exports=e;},function(t,e){t.exports=n;},function(t,e){t.exports=r;},function(t,e){t.exports=i;},function(t,e){t.exports=o;},function(t,e){t.exports=a;},function(t,e){t.exports=u;},function(t,e){t.exports=s;},function(t,e,n){var r,i,o;i=[],void 0===(o="function"==typeof(r=function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}return n.m=t,n.c=e,n.p="",n(0)}([function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(t,e){return t.indexOf(e)},r=window,i=r.document,o=i.documentElement,a=["top","bottom"];function u(t,e){for(var n in e)t[n]=e[n];return t}function s(t){var e,n=r.pageYOffset||o.scrollTop,i=r.pageXOffset||o.scrollLeft,a={left:0,right:0,top:0,bottom:0,width:0,height:0};if((e=t)&&null!=e.setInterval)a.width=r.innerWidth||o.clientWidth,a.height=r.innerHeight||o.clientHeight;else {if(!o.contains(t)||null==t.getBoundingClientRect)return a;u(a,t.getBoundingClientRect()),a.width=a.right-a.left,a.height=a.bottom-a.top;}return a.top=a.top+n-o.clientTop,a.left=a.left+i-o.clientLeft,a.right=a.left+a.width,a.bottom=a.top+a.height,a}var c=function(t,e){return r.getComputedStyle(t)[e]};function l(t){var e=String(c(t,l.propName)),n=e.match(/([0-9.]+)([ms]{1,2})/);return n&&(e=Number(n[1]),"s"===n[2]&&(e*=1e3)),0|e}l.propName=function(){for(var t=i.createElement("div"),e=["transitionDuration","webkitTransitionDuration"],n=0;n<e.length;n++)if(t.style[e[n]]="1s","1s"===t.style[e[n]])return e[n]}();var f=Object.create;function d(t,e){if(!(this instanceof d))return new d(t,e);this.hidden=1,this.options=u(f(d.defaults),e),this._createElement(),t&&this.content(t);}d.prototype._createElement=function(){var t,e;this.element=i.createElement("div"),this.classes=(t=this.element,{add:function(e){t.classList.add(e);},remove:function(e){t.classList.remove(e);}}),this.classes.add(this.options.baseClass);for(var n=0;n<d.classTypes.length;n++)e=d.classTypes[n]+"Class",this.options[e]&&this.classes.add(this.options[e]);},d.prototype.type=function(t){return this.changeClassType("type",t)},d.prototype.effect=function(t){return this.changeClassType("effect",t)},d.prototype.changeClassType=function(t,e){return t+="Class",this.options[t]&&this.classes.remove(this.options[t]),this.options[t]=e,e&&this.classes.add(e),this},d.prototype.updateSize=function(){var t;return this.hidden&&(this.element.style.visibility="hidden",i.body.appendChild(this.element)),this.width=this.element.offsetWidth,this.height=this.element.offsetHeight,null==this.spacing&&(this.spacing=null!=this.options.spacing?this.options.spacing:(t=c(this.element,"top"),0|Math.round(String(t).replace(/[^\-0-9.]/g,"")))),this.hidden?(i.body.removeChild(this.element),this.element.style.visibility=""):this.position(),this},d.prototype.content=function(t){return "object"==typeof t?(this.element.innerHTML="",this.element.appendChild(t)):this.element.innerHTML=t,this.updateSize(),this},d.prototype.place=function(t){return this.options.place=t,this.hidden||this.position(),this},d.prototype.attach=function(t){return this.attachedTo=t,this.hidden||this.position(),this},d.prototype.detach=function(){return this.hide(),this.attachedTo=null,this},d.prototype._pickPlace=function(t){if(!this.options.auto)return this.options.place;var e=s(r),i=this.options.place.split("-"),o=this.spacing;if(-1!==n(a,i[0]))switch(t.top-this.height-o<=e.top?i[0]="bottom":t.bottom+this.height+o>=e.bottom&&(i[0]="top"),i[1]){case "left":t.right-this.width<=e.left&&(i[1]="right");break;case "right":t.left+this.width>=e.right&&(i[1]="left");break;default:t.left+t.width/2+this.width/2>=e.right?i[1]="left":t.right-t.width/2-this.width/2<=e.left&&(i[1]="right");}else switch(t.left-this.width-o<=e.left?i[0]="right":t.right+this.width+o>=e.right&&(i[0]="left"),i[1]){case "top":t.bottom-this.height<=e.top&&(i[1]="bottom");break;case "bottom":t.top+this.height>=e.bottom&&(i[1]="top");break;default:t.top+t.height/2+this.height/2>=e.bottom?i[1]="top":t.bottom-t.height/2-this.height/2<=e.top&&(i[1]="bottom");}return i.join("-")},d.prototype.position=function(t,e){this.attachedTo&&(t=this.attachedTo),null==t&&this._p?(t=this._p[0],e=this._p[1]):this._p=arguments;var n,r,i="number"==typeof t?{left:0|t,right:0|t,top:0|e,bottom:0|e,width:0,height:0}:s(t),o=this.spacing,a=this._pickPlace(i);switch(a!==this.curPlace&&(this.curPlace&&this.classes.remove(this.curPlace),this.classes.add(a),this.curPlace=a),this.curPlace){case "top":n=i.top-this.height-o,r=i.left+i.width/2-this.width/2;break;case "top-left":n=i.top-this.height-o,r=i.right-this.width;break;case "top-right":n=i.top-this.height-o,r=i.left;break;case "bottom":n=i.bottom+o,r=i.left+i.width/2-this.width/2;break;case "bottom-left":n=i.bottom+o,r=i.right-this.width;break;case "bottom-right":n=i.bottom+o,r=i.left;break;case "left":n=i.top+i.height/2-this.height/2,r=i.left-this.width-o;break;case "left-top":n=i.bottom-this.height,r=i.left-this.width-o;break;case "left-bottom":n=i.top,r=i.left-this.width-o;break;case "right":n=i.top+i.height/2-this.height/2,r=i.right+o;break;case "right-top":n=i.bottom-this.height,r=i.right+o;break;case "right-bottom":n=i.top,r=i.right+o;}return this.element.style.top=Math.round(n)+"px",this.element.style.left=Math.round(r)+"px",this},d.prototype.show=function(t,e){return t=this.attachedTo?this.attachedTo:t,clearTimeout(this.aIndex),null!=t&&this.position(t,e),this.hidden&&(this.hidden=0,i.body.appendChild(this.element)),this.attachedTo&&this._aware(),this.options.inClass&&(this.options.effectClass&&this.element.clientHeight,this.classes.add(this.options.inClass)),this},d.prototype.getElement=function(){return this.element},d.prototype.hide=function(){if(!this.hidden){var t=this,e=0;return this.options.inClass&&(this.classes.remove(this.options.inClass),this.options.effectClass&&(e=l(this.element))),this.attachedTo&&this._unaware(),clearTimeout(this.aIndex),this.aIndex=setTimeout((function(){t.aIndex=0,i.body.removeChild(t.element),t.hidden=1;}),e),this}},d.prototype.toggle=function(t,e){return this[this.hidden?"show":"hide"](t,e)},d.prototype.destroy=function(){clearTimeout(this.aIndex),this._unaware(),this.hidden||i.body.removeChild(this.element),this.element=this.options=null;},d.prototype._aware=function(){-1===n(d.winAware,this)&&d.winAware.push(this);},d.prototype._unaware=function(){var t=n(d.winAware,this);-1!==t&&d.winAware.splice(t,1);},d.reposition=function(){var t,e=window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(t){return setTimeout(t,17)};function n(){t=0;for(var e=0,n=d.winAware.length;e<n;e++)d.winAware[e].position();}return function(){!t&&d.winAware.length&&(t=e(n));}}(),d.winAware=[],window.addEventListener("resize",d.reposition),window.addEventListener("scroll",d.reposition),d.classTypes=["type","effect"],d.defaults={baseClass:"tooltip",typeClass:null,effectClass:null,inClass:"in",place:"top",spacing:null,auto:0},e.Tooltip=d;}])})?r.apply(e,i):r)||(t.exports=o);},function(t,e){t.exports=c;},function(t,e){t.exports=l;},function(t,e){t.exports=f;},function(t,e){t.exports=d;},function(t,e){t.exports=h;},function(t,e,n){"use strict";var r,i,o,a,u;if(window.requestAnimationFrame||(r=0,window.requestAnimationFrame=function(t){var e=Date.now(),n=Math.max(0,16-e+r);return r=e+n,setTimeout((function(){t.call(null,e+n);}),n)},window.cancelAnimationFrame=function(t){clearTimeout(t);}),window.requestIdleCallback||(window.requestIdleCallback=function(t,e){return setTimeout(t,e&&e.timeout?e.timeout:0)},window.cancelIdleCallback=function(t){clearTimeout(t);}),Number.isFinite||Object.defineProperty(Number,"isFinite",{value:function(t){return "number"==typeof t&&isFinite(t)},configurable:!0,enumerable:!1,writable:!0}),Number.isNaN||Object.defineProperty(Number,"isNaN",{value:function(t){return "number"==typeof t&&isNaN(t)},configurable:!0,enumerable:!1,writable:!0}),Number.isInteger||Object.defineProperty(Number,"isInteger",{value:function(t){return "number"==typeof t&&isFinite(t)&&Math.floor(t)===t},configurable:!0,enumerable:!1,writable:!0}),Number.MAX_SAFE_INTEGER||Object.defineProperty(Number,"MAX_SAFE_INTEGER",{value:9007199254740991,configurable:!1,enumerable:!1,writable:!1}),Math.sign||(Math.sign=function(t){return (t>0)-(t<0)||Number(t)}),Array.prototype.find||Object.defineProperty(Array.prototype,"find",{value:function(t){if(null==this)throw new TypeError("Array.prototype.find called on null or undefined");if("function"!=typeof t)throw new TypeError("predicate must be a function");for(var e,n=Object(this),r=n.length>>>0,i=arguments[1],o=0;o<r;o++)if(e=n[o],t.call(i,e,o,n))return e},configurable:!0,enumerable:!1,writable:!0}),Array.prototype.findIndex||Object.defineProperty(Array.prototype,"findIndex",{value:function(t){if(null==this)throw new TypeError("Array.prototype.findIndex called on null or undefined");if("function"!=typeof t)throw new TypeError("predicate must be a function");for(var e,n=Object(this),r=n.length>>>0,i=arguments[1],o=0;o<r;o++)if(e=n[o],t.call(i,e,o,n))return o;return -1},configurable:!0,enumerable:!1,writable:!0}),!Array.from){Object.defineProperty(Array,"from",{value:(i=Object.prototype.toString,o=function(t){return "function"==typeof t||"[object Function]"===i.call(t)},a=Math.pow(2,53)-1,u=function(t){var e=function(t){var e=Number(t);return isNaN(e)?0:0!==e&&isFinite(e)?(e>0?1:-1)*Math.floor(Math.abs(e)):e}(t);return Math.min(Math.max(e,0),a)},function(t){var e=this,n=Object(t);if(null==t)throw new TypeError("Array.from requires an array-like object - not null or undefined");var r,i=arguments.length>1?arguments[1]:void 0;if(void 0!==i){if(!o(i))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(r=arguments[2]);}for(var a,s=u(n.length),c=o(e)?Object(new e(s)):new Array(s),l=0;l<s;)a=n[l],c[l]=i?void 0===r?i(a,l):i.call(r,a,l):a,l+=1;return c.length=s,c}),configurable:!0,enumerable:!1,writable:!0});var s=Map.prototype.set;Object.defineProperty(Map.prototype,"set",{value:function(){return s.apply(this,arguments),this},configurable:!0,enumerable:!1,writable:!0}),Object.defineProperty(Map.prototype,"values",{value:function(){var t={},e=0;return this.forEach((function(n){return t[String(e++)]=n})),t.length=e,t},configurable:!0,enumerable:!1,writable:!0}),Object.defineProperty(Map.prototype,"entries",{value:function(){var t={},e=0;return this.forEach((function(n,r){return t[String(e++)]=[r,n]})),t.length=e,t},configurable:!0,enumerable:!1,writable:!0});}Object.assign||Object.defineProperty(Object,"assign",{value:function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var r=arguments[n];if(null!=r)for(var i in r)r.hasOwnProperty(i)&&(e[i]=r[i]);}return e},configurable:!0,enumerable:!1,writable:!0}),Element.prototype.matches||Object.defineProperty(Element.prototype,"matches",{value:Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,configurable:!0,enumerable:!0,writable:!0});},,,,function(t,e,n){t.exports=n(1);}])})); 
	} (taucharts$1, taucharts$1.exports));
	return taucharts$1.exports;
}

var tauchartsExports = requireTaucharts();
var Taucharts = /*@__PURE__*/getDefaultExportFromCjs(tauchartsExports);

var tooltip$2 = {exports: {}};

/*!
 * /*
 * taucharts@2.8.0 (2020-02-26)
 * Copyright 2020 Targetprocess, Inc.
 * Licensed under Apache License 2.0
 * * /
 * 
 */
var tooltip$1 = tooltip$2.exports;

var hasRequiredTooltip;

function requireTooltip () {
	if (hasRequiredTooltip) return tooltip$2.exports;
	hasRequiredTooltip = 1;
	(function (module, exports) {
		!function(t,e){if("object"=='object'&&"object"=='object')module.exports=e(requireTaucharts(),require$$1$2);else if("function"==typeof undefined&&undefined.amd)undefined(["taucharts","d3-selection"],e);else {var i="object"=='object'?e(requireTaucharts(),require$$1$2):e(t.Taucharts,t.d3);for(var n in i)("object"=='object'?exports:t)[n]=i[n];}}(window,(function(t,e){return function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n});},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=33)}({0:function(e,i){e.exports=t;},1:function(t,i){t.exports=e;},2:function(t,e,i){"use strict";i.d(e,"a",(function(){return n})),i.d(e,"b",(function(){return o}));var n="tau-chart__tooltip";function o(t,e){return {render:function(t){return this.args=t,t=Object.assign({},t,{fields:this.filterFields(t.fields)}),this.rootTemplate(t)},rootTemplate:function(t){return ['<div class="'+n+"__buttons "+n+'__clickable">',this.buttonsTemplate(),"</div>",'<div class="i-role-content '+n+'__content">',this.contentTemplate(t),"</div>"].join("\n")},contentTemplate:function(t){return this.fieldsTemplate(t)},filterFields:function(t){return t},getLabel:function(e){return t.getFieldLabel(e)},getFormatter:function(e){return t.getFieldFormat(e)},fieldsTemplate:function(t){var e=this,i=t.data;return t.fields.map((function(t){return e.itemTemplate({data:i,field:t})})).join("\n")},itemTemplate:function(t){var e=t.data,i=t.field,o=this.getLabel(i),r=this.getFormatter(i)(e[i]);return ['<div class="'+n+'__list__item">','  <div class="'+n+'__list__elem">'+o+"</div>",'  <div class="'+n+'__list__elem">'+r+"</div>","</div>"].join("\n")},buttonsTemplate:function(){return [this.buttonTemplate({cls:"i-role-exclude",text:"Exclude",icon:function(){return '<span class="tau-icon-close-gray"></span>'}})].join("\n")},buttonTemplate:function(t){var e=t.icon,i=t.text,o=t.cls;return ['<div class="'+n+"__button "+o+'">','  <div class="'+n+'__button__wrap">',"    "+(e?e()+" ":"")+i,"  </div>","</div>"].join("\n")},didMount:function(){var e=t.getDomNode().querySelector(".i-role-exclude");e&&e.addEventListener("click",(function(){t.excludeHighlightedElement(),t.setState({highlight:null,isStuck:!1});}));}}}},3:function(t,e,i){"use strict";var n=i(0),o=i.n(n),r=i(1),s=i(2),l=o.a.api.utils,a=o.a.api.domUtils,c=o.a.api.pluginsSDK,u=function(){function t(t){this.settings=l.defaults(t||{},{align:"bottom-right",clickable:!0,clsClickable:"tau-chart__tooltip__clickable",clsStuck:"stuck",clsTarget:"tau-chart__tooltip-target",escapeHtml:!0,fields:null,formatters:{},getTemplate:null,spacing:24,winBound:12,onExclude:function(){}}),this.onRender=this._getRenderHandler();}return t.prototype.init=function(t){this._chart=t,this._tooltip=this._chart.addBalloon({spacing:this.settings.spacing,winBound:this.settings.winBound,auto:!0,effectClass:"fade"}),this._initDomEvents(),this.state={highlight:null,isStuck:!1},this.setState(this.state),this._template=this._getTemplate();},t.prototype._getTemplate=function(){var t=Object(s.b)(this,this.settings);return "function"==typeof this.settings.getTemplate?this.settings.getTemplate(t,this,this.settings):t},t.prototype._renderTemplate=function(t,e){return this._template.render({data:t,fields:e})},t.prototype._initDomEvents=function(){var t=this;this._scrollHandler=function(){t.setState({highlight:null,isStuck:!1});},window.addEventListener("scroll",this._scrollHandler,!0),this.settings.clickable&&(this._outerClickHandler=function(e){var i=Array.from(document.querySelectorAll("."+t.settings.clsClickable)).concat(t.getDomNode()).map((function(t){return t.getBoundingClientRect()})),n=Math.min.apply(Math,i.map((function(t){return t.top}))),o=Math.min.apply(Math,i.map((function(t){return t.left}))),r=Math.max.apply(Math,i.map((function(t){return t.right}))),s=Math.max.apply(Math,i.map((function(t){return t.bottom})));(e.clientX<o||e.clientX>r||e.clientY<n||e.clientY>s)&&t.setState({highlight:null,isStuck:!1});});},t.prototype.getDomNode=function(){return this._tooltip.getElement()},t.prototype.setState=function(t){var e=this,i=this.settings,n=this.state,o=this.state=Object.assign({},n,t);n.highlight=n.highlight||{data:null,cursor:null,unit:null},o.highlight=o.highlight||{data:null,cursor:null,unit:null},o.isStuck&&n.highlight.data&&(o.highlight=n.highlight),o.highlight.data!==n.highlight.data&&(o.highlight.data?(this._hideTooltip(),this._showTooltip(o.highlight.data,o.highlight.cursor),this._setTargetSvgClass(!0),requestAnimationFrame((function(){e._setTargetSvgClass(!0);}))):o.isStuck||!n.highlight.data||o.highlight.data||(this._removeFocus(),this._hideTooltip(),this._setTargetSvgClass(!1))),!o.highlight.data||n.highlight.cursor&&o.highlight.cursor.x===n.highlight.cursor.x&&o.highlight.cursor.y===n.highlight.cursor.y||(this._tooltip.position(o.highlight.cursor.x,o.highlight.cursor.y),this._tooltip.updateSize());var r=this.getDomNode();this.settings.clickable&&o.isStuck!==n.isStuck&&(o.isStuck?(window.addEventListener("click",this._outerClickHandler,!0),r.classList.add(i.clsStuck),this._setTargetEventsEnabled(!1),this._accentFocus(o.highlight.data),this._tooltip.updateSize()):(window.removeEventListener("click",this._outerClickHandler,!0),r.classList.remove(i.clsStuck),requestAnimationFrame((function(){e._setTargetEventsEnabled(!0);var t=e._chart.getSVG();t&&a.dispatchMouseEvent(t,"mouseleave");}))));},t.prototype._showTooltip=function(t,e){var i=this.settings,n=i.fields||"function"==typeof i.getFields&&i.getFields(this._chart)||Object.keys(t),o=this._renderTemplate(t,n);this._tooltip.content(o).position(e.x,e.y).place(i.align).show().updateSize(),this._template.didMount&&this._template.didMount();},t.prototype._hideTooltip=function(){window.removeEventListener("click",this._outerClickHandler,!0),this._template.willUnmount&&this._template.willUnmount(),this._tooltip.hide();},t.prototype.destroy=function(){window.removeEventListener("scroll",this._scrollHandler,!0),this._setTargetSvgClass(!1),this.setState({highlight:null,isStuck:!1}),this._tooltip.destroy();},t.prototype._subscribeToHover=function(){var t=this,e=["ELEMENT.LINE","ELEMENT.AREA","ELEMENT.PATH","ELEMENT.INTERVAL","ELEMENT.INTERVAL.STACKED","ELEMENT.POINT"];this._chart.select((function(t){return e.indexOf(t.config.type)>=0})).forEach((function(e){e.on("data-hover",(function(e,i){var n=document.body.getBoundingClientRect();t.setState({highlight:i.data?{data:i.data,cursor:{x:i.event.clientX-n.left,y:i.event.clientY-n.top},unit:i.unit}:null});})),t.settings.clickable&&e.on("data-click",(function(e,i){var n=document.body.getBoundingClientRect();t.setState(i.data?{highlight:{data:i.data,cursor:{x:i.event.clientX-n.left,y:i.event.clientY-n.top},unit:i.unit},isStuck:!0}:{highlight:null,isStuck:null});}));}));},t.prototype.getFieldFormat=function(t){var e=this._formatters[t]?this._formatters[t].format:function(t){return String(t)};return this.settings.escapeHtml?function(t){return l.escapeHtml(e(t))}:e},t.prototype.getFieldLabel=function(t){var e=this._formatters[t]?this._formatters[t].label:t;return this.settings.escapeHtml?l.escapeHtml(e):e},t.prototype._accentFocus=function(t){var e=function(e){return e===t};this._chart.select((function(){return !0})).forEach((function(t){t.fire("highlight",e);}));},t.prototype._removeFocus=function(){var t=function(){return null};this._chart.select((function(){return !0})).forEach((function(e){e.fire("highlight",t),e.fire("highlight-data-points",t);}));},t.prototype.excludeHighlightedElement=function(){var t=this.state.highlight.data;this._chart.addFilter({tag:"exclude",predicate:function(e){return e!==t}}),this.settings.onExclude(t),this._chart.refresh();},t.prototype._getRenderHandler=function(){return function(){this._formatters=c.getFieldFormatters(this._chart.getSpec(),this.settings.formatters),this._subscribeToHover(),this.setState({highlight:null,isStuck:!1});}},t.prototype._setTargetSvgClass=function(t){r.select(this._chart.getSVG()).classed(this.settings.clsTarget,t);},t.prototype._setTargetEventsEnabled=function(t){t?this._chart.enablePointerEvents():this._chart.disablePointerEvents();},t}();e.a=u;},33:function(t,e,i){"use strict";i.r(e);var n=i(0),o=i.n(n),r=i(3);function s(t){return new r.a(t)}o.a.api.plugins.add("tooltip",s),e.default=s;}})})); 
	} (tooltip$2, tooltip$2.exports));
	return tooltip$2.exports;
}

var tooltipExports = requireTooltip();
var tooltip = /*@__PURE__*/getDefaultExportFromCjs(tooltipExports);

var legend$2 = {exports: {}};

/*!
 * /*
 * taucharts@2.8.0 (2020-02-26)
 * Copyright 2020 Targetprocess, Inc.
 * Licensed under Apache License 2.0
 * * /
 * 
 */
var legend$1 = legend$2.exports;

var hasRequiredLegend;

function requireLegend () {
	if (hasRequiredLegend) return legend$2.exports;
	hasRequiredLegend = 1;
	(function (module, exports) {
		!function(e,t){if("object"=='object'&&"object"=='object')module.exports=t(requireTaucharts(),require$$1);else if("function"==typeof undefined&&undefined.amd)undefined(["taucharts","d3-format"],t);else {var r="object"=='object'?t(requireTaucharts(),require$$1):t(e.Taucharts,e.d3);for(var n in r)("object"=='object'?exports:e)[n]=r[n];}}(window,(function(e,t){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n});},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=28)}({0:function(t,r){t.exports=e;},28:function(e,t,r){"use strict";r.r(t);var n,a,i=r(0),o=r.n(i),c=r(9),l=o.a.api.utils,s=o.a.api.pluginsSDK,u=0,d=o.a.api.utils.xml,h=function(e,t){var r=e[0],n=e[1],a=(n-r)/(t-1),i=l.range(t-2).map((function(e){return r+a*(e+1)}));return [r].concat(i).concat(n)},_=function(e){return Math.log(e)/Math.LN10},f=function(e){return 0===e?0:Math.floor(_(Math.abs(e)))},g=(n=/\.0+([^\d].*)?$/,a=/(\.\d+?)0+([^\d].*)?$/,function(e){return e.replace(n,"$1").replace(a,"$1$2")}),m=c.format(".3s"),p=function(e){return g(m(e))},v=function(e,t){var r=Math.max(Math.abs(e),Math.abs(t)),n=f(r),a=e*t>0?Math.abs(t-e):r,i=f(a),o=Math.abs(n-i);return Math.abs(n)>3&&o<=3?p:function(e){var t=f(r-e),n=Math.min((i<0?Math.abs(i):0)+(t<i?1:0),20);return g(e.toFixed(n))}};function b(e){var t=!0,r=l.defaults(e||{},{formatters:{},onSelect:function(){}}),n=function(e){return null===e||""===e||void 0===e},a=function(e){return e.every((function(e){return l.isDate(e)}))},i=function(e,t){return function(r){var a=r[e],i=JSON.stringify(n(a)?null:a);return t===i}},o=function(e,t,r,n){e.addEventListener(t,(function(e){for(var t=e.target;t!==e.currentTarget&&null!==t;)t.matches(r)&&n(e,t),t=t.parentNode;}));};return {init:function(e){var t=this;this.instanceId=++u,this._chart=e,this._currentFilters={},this._legendColorByScaleId={},this._legendOrderState={};var n=this._chart.getSpec(),a=function(e){return function(t,r){var a=n.scales[r];return a.type===e&&a.dim&&t.push(r),t}};this._color=Object.keys(n.scales).reduce(a("color"),[]).filter((function(t){return e.getScaleInfo(t).discrete})),this._fill=Object.keys(n.scales).reduce(a("color"),[]).filter((function(t){return !e.getScaleInfo(t).discrete})),this._size=Object.keys(n.scales).reduce(a("size"),[]);var i=this._color.length>0,c=this._fill.length>0,l=this._size.length>0;if(this._assignStaticBrewersOrEx(),i||c||l){switch(r.position){case "left":this._container=this._chart.insertToLeftSidebar(this._containerTemplate);break;case "right":this._container=this._chart.insertToRightSidebar(this._containerTemplate);break;case "top":this._container=this._chart.insertToHeader(this._containerTemplate);break;case "bottom":this._container=this._chart.insertToFooter(this._containerTemplate);break;default:this._container=this._chart.insertToRightSidebar(this._containerTemplate);}i&&(o(this._container,"click",".tau-chart__legend__reset",(function(e,r){t._toggleLegendItem(r,"reset");})),o(this._container,"click",".tau-chart__legend__item-color",(function(e,r){var n=e.ctrlKey||e.target.matches(".tau-chart__legend__guide--color__overlay")?"leave-others":"focus-single";t._toggleLegendItem(r,n);})),o(this._container,"mouseover",".tau-chart__legend__item-color",(function(e,r){t._highlightToggle(r,!0);})),o(this._container,"mouseout",".tau-chart__legend__item-color",(function(e,r){t._highlightToggle(r,!1);})));}},destroy:function(){var e=this._currentFilters,t=this._chart;Object.keys(e).forEach((function(r){return t.removeFilter(e[r])})),this._container&&this._container.parentElement&&(this._clearPanel(),this._container.parentElement.removeChild(this._container));},onSpecReady:function(e,t){this._formatters=s.getFieldFormatters(t,r.formatters);},_getFormat:function(e){return this._formatters[e]?this._formatters[e].format:function(e){return String(e)}},onRender:function(){var e=this;if(t&&r.selectedCategories&&0!==r.selectedCategories.length){var n=this._getLegendColorByScales();return Object.keys(n).forEach((function(t){n[t].legendColorItems.forEach((function(t){var n=t.value,a=t.dim;if(-1===r.selectedCategories.indexOf(JSON.parse(n))){var o=a+n,c=i(a,n);e._currentFilters[o]=e._chart.addFilter({tag:"legend",predicate:function(e){return !c(e)}});}}));})),t=!1,void this._chart.refresh()}this._clearPanel(),this._drawColorLegend(),this._drawFillLegend(),this._drawSizeLegend();},_containerTemplate:'<div class="tau-chart__legend"></div>',_template:l.template(['<div class="tau-chart__legend__wrap">',"<%=top%>",'<div class="tau-chart__legend__title"><%=name%></div>',"<%=items%>","</div>"].join("")),_itemTemplate:l.template(["<div data-scale-id='<%= scaleId %>' data-dim='<%= dim %>' data-value='<%= value %>' class=\"tau-chart__legend__item tau-chart__legend__item-color <%=classDisabled%>\">",'   <div class="tau-chart__legend__guide__wrap">','   <div class="tau-chart__legend__guide tau-chart__legend__guide--color <%=cssClass%>"','        style="background-color: <%=cssColor%>; border-color: <%=borderColor%>;">','       <div class="tau-chart__legend__guide--color__overlay">',"       </div>","   </div>","   </div>",'   <span class="tau-chart__legend__guide__label"><%=label%></span>',"</div>"].join("")),_resetTemplate:l.template(['<div class="tau-chart__legend__reset <%=classDisabled%>">','    <div role="button" class="tau-chart__button">Reset</div>',"</div>"].join("")),_clearPanel:function(){this._container&&(clearTimeout(this._scrollTimeout),this._getScrollContainer().removeEventListener("scroll",this._scrollListener),this._container.innerHTML="");},_drawFillLegend:function(){var e=this;e._fill.forEach((function(t){var r,n,i=e._chart.select((function(e){return e.config.color===t}))[0];if(i){var o=i.config.guide||{},c=i.getScale("color"),u=c.domain().sort((function(e,t){return e-t})),_=a(u),f=_?u.map(Number):u,g=v(f[0],f[f.length-1]),m=function(){var t=e._chart.getSpec(),r=s.extractFieldsFormatInfo(t)[c.dim].format;return r||(r=function(e){return new Date(e)}),function(e){return String(r(e))}}(),p=_?m:g,b=c.brewer.length,y=((o.color||{}).label||{}).text||c.dim,x=function(e){return 13*e.length*.618},S=c.isInteger?(f[1]-f[0])%3==0?4:(f[1]-f[0])%2==0?3:2:3,w=h(f,S),M=(_?w.map((function(e){return new Date(e)})):w).map(p);M[0]===M[M.length-1]&&(M=[M[0]]),e._container.insertAdjacentHTML("beforeend",e._template({name:l.escape(y),top:null,items:'<div class="tau-chart__legend__gradient-wrapper"></div>'}));var T=e._container.lastElementChild.querySelector(".tau-chart__legend__gradient-wrapper"),C=T.getBoundingClientRect().width,L=!1;M.reduce((function(e,t){return e+x(t)}),0)>C&&(M.length>1&&x(M[0])+x(M[M.length-1])>C?L=!0:M=[M[0],M[M.length-1]]);var j=L?{width:C,height:120,barX:0,barY:0,barWidth:20,barHeight:120,textAnchor:"start",textX:l.range(S).map((function(){return 25})),textY:1===M.length?68.034:M.map((function(e,t){var r=(M.length-1-t)/(M.length-1);return 13*(1-r)+120*r-2.483}))}:(r=x(M[0])/2,n=x(M[M.length-1])/2,{width:C,height:41,barX:0,barY:0,barWidth:C,barHeight:20,textAnchor:"middle",textX:1===M.length?[C/2]:M.map((function(e,t){var a=t/(M.length-1);return r*(1-a)+(C-n)*a})),textY:l.range(S).map((function(){return 41}))}),F=h(f,b).map((function(e,t){return d("stop",{offset:t/(b-1)*100+"%",style:"stop-color:"+c(e)+';stop-opacity:1"'})})),A="legend-gradient-"+e.instanceId,O=d.apply(void 0,["svg",{class:"tau-chart__legend__gradient",width:j.width,height:j.height},d("defs",d.apply(void 0,["linearGradient",{id:A,x1:"0%",y1:L?"100%":"0%",x2:L?"0%":"100%",y2:"0%"}].concat(F))),d("rect",{class:"tau-chart__legend__gradient__bar",x:j.barX,y:j.barY,width:j.barWidth,height:j.barHeight,fill:"url(#"+A+")"})].concat(M.map((function(e,t){return d("text",{x:j.textX[t],y:j.textY[t],"text-anchor":j.textAnchor},e)}))));T.insertAdjacentHTML("beforeend",O);}}));},_drawSizeLegend:function(){var e=this;e._size.forEach((function(t){var r=e._chart.select((function(e){return e.config.size===t}))[0];if(r){var n=r.config.guide||{},a=r.getScale("size"),i=a.domain().sort((function(e,t){return e-t}));if(!Array.isArray(i)||!i.every(isFinite))return;var o=((n.size||{}).label||{}).text||a.dim,c=i[0],s=i[i.length-1],u=[c];if(s-c){var h=_(s-c),f=Math.round(4-h),g=Math.pow(10,f),m=function(e,t,r){if(e.length<3)return e.slice(0);if(t<3)return [e[0],e[e.length-1]];var n,a=e[0]<0?Math.abs(e[0]):0,i=function(e){return e},o="sqrt"===r?function(e){return Math.sqrt(e+a)}:i,c="sqrt"===r?function(e){return Math.pow(e,2)-a}:i,s=[(e=e.map(o))[0]],u=e[e.length-1]-e[0],d=.5*u/(t-1),h=l.range(1,t-1).map((function(e){var r=u*e/(t-1);return {min:r-d,mid:r,max:r+d,diff:Number.MAX_VALUE,closest:null}})),_=0,f=function(){if(_!==h.length){var e=n;(n=h[_++]).min=Math.max(n.min,(e&&null!==e.closest?e.closest:s[0])+d);}};return f(),e.forEach((function(e){if(!(e<n.min)){e>n.max&&f();var t=Math.abs(e-n.mid);t<n.diff&&t<d?(n.diff=t,n.closest=e):f(),0===t&&f();}})),h.forEach((function(e){null!==e.closest&&s.push(e.closest);})),s.push(e[e.length-1]),s=s.map(c)}(l.unique(e._chart.getDataSources({excludeFilter:["legend"]})[a.source].data.map((function(e){return e[a.dim]})).filter((function(e){return e>=c&&e<=s}))).sort((function(e,t){return e-t})),4,a.funcType);u=l.unique(m.map((function(e){return Math.round(e*g)/g})));}var p=v(u[0],u[u.length-1]),b=function(e){return 13*e.length*.618};u.reverse();var y=u.map(a),x=Math.max.apply(null,y),S=u.map(p);e._container.insertAdjacentHTML("beforeend",e._template({name:l.escape(o),top:null,items:'<div class="tau-chart__legend__size-wrapper"></div>'}));var w=e._container.lastElementChild.querySelector(".tau-chart__legend__size-wrapper"),M=w.getBoundingClientRect().width,T=!1;(Math.max.apply(null,S.map(b))>M/4||1===S.length)&&(T=!0);var C=T?function(){for(var e=y[0]/2,t=y[y.length-1]/2,r=[e],n=1,a=void 0,i=void 0;n<y.length;n++)i=y[n-1]/2,a=y[n]/2,r.push(r[n-1]+Math.max(13*1.618,i+13+a));return {width:M,height:r[r.length-1]+Math.max(t,6.5),circleX:l.range(y.length).map((function(){return x/2})),circleY:r,textAnchor:"start",textX:l.range(S.length).map((function(){return x+8})),textY:r.map((function(e){return e+4.017}))}}():function(){for(var e=Math.max(b(S[0])/2,y[0]/2),t=Math.max(b(S[S.length-1])/2,y[y.length-1]/2),r=(M-y.reduce((function(e,t,r){return e+(0===r||r===y.length-1?t/2:t)}),0)-e-t)/3,n=[e],a=1,i=void 0,o=void 0;a<y.length;a++)o=y[a-1]/2,i=y[a]/2,n.push(n[a-1]+o+r+i);var c=y.map((function(e){return x-e/2}));return {width:M,height:x+8+13,circleX:n,circleY:c,textAnchor:"middle",textX:n,textY:l.range(S.length).map((function(){return x+8+13}))}}(),L=d.apply(void 0,["svg",{class:"tau-chart__legend__size",width:C.width,height:C.height}].concat(y.map((function(e,t){return d("circle",{class:"tau-chart__legend__size__item__circle "+(r.config.color?"color-definite":"color-default-size"),cx:C.circleX[t],cy:C.circleY[t],r:e/2})})),S.map((function(e,t){return d("text",{class:"tau-chart__legend__size__item__label",x:C.textX[t],y:C.textY[t],"text-anchor":C.textAnchor},e)}))));w.insertAdjacentHTML("beforeend",L);}}));},_getLegendColorByScales:function(){var e=this;return e._color.reduce((function(t,r){var i=e._chart.select((function(e){return e.config.color===r}))[0];if(i){var o=i.config.guide||{},c=i.getScale("color"),s=e._chart.getDataSources({excludeFilter:["legend"]}),u=l.unique(s[c.source].data.map((function(e){return e[c.dim]}))),d=e._chart.getSpec().scales[r],h=a(u);if(d.order)u=l.union(l.intersection(d.order,u),u);else if("order"===d.dimType&&h)u=u.sort((function(e,t){return new Date(e)-new Date(t)}));else {var _=e._legendOrderState[r];u=u.sort((function(e,t){var r=_[e]-_[t];return r&&r/Math.abs(r)}));}var f=((o.color||{}).label||{}).text||c.dim,g=(o.color||{}).tickFormatNullAlias||"No "+f,m=e._getFormat(c.dim),p=u.map((function(t){var a=JSON.stringify(n(t)?null:t),i=c.dim+a;return {scaleId:r,dim:c.dim,color:c(t),disabled:e._currentFilters.hasOwnProperty(i),label:m(t),value:a}}));t[r]={legendColorItems:p,title:f,colorScale:c,noVal:g};}return t}),{})},_drawColorLegend:function(){var e=this,t=this._getLegendColorByScales();Object.keys(t).forEach((function(r){var a=t[r],i=a.legendColorItems,o=a.title,c=a.colorScale,s=a.noVal;e._container.insertAdjacentHTML("beforeend",e._template({name:l.escape(o),top:e._resetTemplate({classDisabled:i.some((function(e){return e.disabled}))?"":"disabled"}),items:i.map((function(t){return e._itemTemplate({scaleId:t.scaleId,dim:l.escape(t.dim),color:t.color,cssClass:c.toClass(t.color),cssColor:t.disabled?"transparent":c.toColor(t.color),borderColor:c.toColor(t.color),classDisabled:t.disabled?"disabled":"",label:l.escape(n(t.label)?s:t.label),value:l.escape(t.value)})})).join("")}));})),e._color.length>0&&(e._updateResetButtonPosition(),e._scrollTimeout=null,e._scrollListener=function(){var t=e._container.querySelector(".tau-chart__legend__reset");t.style.display="none",e._scrollTimeout&&clearTimeout(e._scrollTimeout),e._scrollTimeout=setTimeout((function(){e._updateResetButtonPosition(),t.style.display="",e._scrollTimeout=null;}),250);},e._getScrollContainer().addEventListener("scroll",e._scrollListener));},_toggleLegendItem:function(e,t){var n=this,a=this._currentFilters,o=e?Array.prototype.filter.call(e.parentNode.childNodes,(function(e){return e.matches(".tau-chart__legend__item-color")})):null,c=function(e){var t=e.getAttribute("data-dim"),r=e.getAttribute("data-value");return {sid:e.getAttribute("data-scale-id"),dim:t,val:r,key:t+r}},l=function(e){return e in a},s=function(e,t){var r=c(e);if(l(r.key)===t)if(t){var o=a[r.key];delete a[r.key],e.classList.remove("disabled"),n._chart.removeFilter(o);}else {e.classList.add("disabled");var s=i(r.dim,r.val);a[r.key]=n._chart.addFilter({tag:"legend",predicate:function(e){return !s(e)}});}},u=function(t){return t===e},d=!!e&&l(c(e).key),h=function(e,t){e.querySelector(".tau-chart__legend__guide").style.backgroundColor=t?"":"transparent";};if("reset"===t)o.forEach((function(e){s(e,!0),h(e,!0);}));else if("leave-others"===t)o.forEach((function(e){u(e)&&s(e,d);})),h(e,d);else if("focus-single"===t){var _=!d&&o.every((function(e){return u(e)||l(c(e).key)}));o.forEach((function(e){var t=u(e)||_;s(e,t);})),d&&h(e,!0);}var f=o.filter((function(e){return !l(c(e).key)})).map((function(e){return JSON.parse(c(e).val)}));r.onSelect({type:t,selectedCategories:f}),this._chart.refresh();},_highlightToggle:function(e,t){if(!e.matches(".disabled")){var r=e.getAttribute("data-dim"),n=e.getAttribute("data-value"),a=t?i(r,n):function(e){return null};this._chart.select((function(e){return !0})).forEach((function(e){e.fire("highlight",a);}));}},_getScrollContainer:function(){return this._container.parentNode.parentNode},_updateResetButtonPosition:function(){this._container.querySelector(".tau-chart__legend__reset").style.top=this._getScrollContainer().scrollTop+"px";},_generateColorMap:function(e,t){var r=t.length;return e.reduce((function(e,n,a){return e[n]=t[a%r],e}),{})},_assignStaticBrewersOrEx:function(){var e=this;e._color.forEach((function(t){var r=e._chart.getSpec().scales[t],n=e._chart.getDataSources({excludeFilter:["legend"]}),a=e._chart.getScaleFactory(n).createScaleInfoByName(t).domain();if(!r.brewer||Array.isArray(r.brewer)){var i=r.brewer||l.range(20).map((function(e){return "color20-"+(1+e)}));r.brewer=e._generateColorMap(a,i);}e._legendOrderState[t]=a.reduce((function(e,t,r){return e[t]=r,e}),{});}));}}}o.a.api.plugins.add("legend",b),t.default=b;},9:function(e,r){e.exports=t;}})})); 
	} (legend$2, legend$2.exports));
	return legend$2.exports;
}

var legendExports = requireLegend();
var legend = /*@__PURE__*/getDefaultExportFromCjs(legendExports);

var colorBrewer$1 = {exports: {}};

/*!
 * /*
 * taucharts@2.8.0 (2020-02-26)
 * Copyright 2020 Targetprocess, Inc.
 * Licensed under Apache License 2.0
 * * /
 * 
 */
var colorBrewer = colorBrewer$1.exports;

var hasRequiredColorBrewer;

function requireColorBrewer () {
	if (hasRequiredColorBrewer) return colorBrewer$1.exports;
	hasRequiredColorBrewer = 1;
	(function (module, exports) {
		!function(f,d){if("object"=='object'&&"object"=='object')module.exports=d(requireTaucharts());else if("function"==typeof undefined&&undefined.amd)undefined(["taucharts"],d);else {var e="object"=='object'?d(requireTaucharts()):d(f.Taucharts);for(var b in e)("object"=='object'?exports:f)[b]=e[b];}}(window,(function(f){return function(f){var d={};function e(b){if(d[b])return d[b].exports;var c=d[b]={i:b,l:!1,exports:{}};return f[b].call(c.exports,c,c.exports,e),c.l=!0,c.exports}return e.m=f,e.c=d,e.d=function(f,d,b){e.o(f,d)||Object.defineProperty(f,d,{enumerable:!0,get:b});},e.r=function(f){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(f,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(f,"__esModule",{value:!0});},e.t=function(f,d){if(1&d&&(f=e(f)),8&d)return f;if(4&d&&"object"==typeof f&&f&&f.__esModule)return f;var b=Object.create(null);if(e.r(b),Object.defineProperty(b,"default",{enumerable:!0,value:f}),2&d&&"string"!=typeof f)for(var c in f)e.d(b,c,function(d){return f[d]}.bind(null,c));return b},e.n=function(f){var d=f&&f.__esModule?function(){return f.default}:function(){return f};return e.d(d,"a",d),d},e.o=function(f,d){return Object.prototype.hasOwnProperty.call(f,d)},e.p="",e(e.s=13)}({0:function(d,e){d.exports=f;},13:function(f,d,e){"use strict";e.r(d);var b=e(0),c={YlGn:{3:["#f7fcb9","#addd8e","#31a354"],4:["#ffffcc","#c2e699","#78c679","#238443"],5:["#ffffcc","#c2e699","#78c679","#31a354","#006837"],6:["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],7:["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],8:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],9:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]},YlGnBu:{3:["#edf8b1","#7fcdbb","#2c7fb8"],4:["#ffffcc","#a1dab4","#41b6c4","#225ea8"],5:["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],6:["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],7:["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],8:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],9:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]},GnBu:{3:["#e0f3db","#a8ddb5","#43a2ca"],4:["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe"],5:["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],6:["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],7:["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],8:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],9:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]},BuGn:{3:["#e5f5f9","#99d8c9","#2ca25f"],4:["#edf8fb","#b2e2e2","#66c2a4","#238b45"],5:["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],6:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],7:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],8:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],9:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]},PuBuGn:{3:["#ece2f0","#a6bddb","#1c9099"],4:["#f6eff7","#bdc9e1","#67a9cf","#02818a"],5:["#f6eff7","#bdc9e1","#67a9cf","#1c9099","#016c59"],6:["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],7:["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],8:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],9:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"]},PuBu:{3:["#ece7f2","#a6bddb","#2b8cbe"],4:["#f1eef6","#bdc9e1","#74a9cf","#0570b0"],5:["#f1eef6","#bdc9e1","#74a9cf","#2b8cbe","#045a8d"],6:["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],7:["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],8:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],9:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"]},BuPu:{3:["#e0ecf4","#9ebcda","#8856a7"],4:["#edf8fb","#b3cde3","#8c96c6","#88419d"],5:["#edf8fb","#b3cde3","#8c96c6","#8856a7","#810f7c"],6:["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],7:["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],8:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],9:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]},RdPu:{3:["#fde0dd","#fa9fb5","#c51b8a"],4:["#feebe2","#fbb4b9","#f768a1","#ae017e"],5:["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"],6:["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],7:["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],8:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],9:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]},PuRd:{3:["#e7e1ef","#c994c7","#dd1c77"],4:["#f1eef6","#d7b5d8","#df65b0","#ce1256"],5:["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],6:["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],7:["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],8:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],9:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]},OrRd:{3:["#fee8c8","#fdbb84","#e34a33"],4:["#fef0d9","#fdcc8a","#fc8d59","#d7301f"],5:["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"],6:["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],7:["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],8:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],9:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]},YlOrRd:{3:["#ffeda0","#feb24c","#f03b20"],4:["#ffffb2","#fecc5c","#fd8d3c","#e31a1c"],5:["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"],6:["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],7:["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],8:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],9:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]},YlOrBr:{3:["#fff7bc","#fec44f","#d95f0e"],4:["#ffffd4","#fed98e","#fe9929","#cc4c02"],5:["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"],6:["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],7:["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],8:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],9:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"]},Purples:{3:["#efedf5","#bcbddc","#756bb1"],4:["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"],5:["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"],6:["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"],7:["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],8:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],9:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]},Blues:{3:["#deebf7","#9ecae1","#3182bd"],4:["#eff3ff","#bdd7e7","#6baed6","#2171b5"],5:["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"],6:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],7:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],8:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],9:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]},Greens:{3:["#e5f5e0","#a1d99b","#31a354"],4:["#edf8e9","#bae4b3","#74c476","#238b45"],5:["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"],6:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],7:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],8:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],9:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]},Oranges:{3:["#fee6ce","#fdae6b","#e6550d"],4:["#feedde","#fdbe85","#fd8d3c","#d94701"],5:["#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"],6:["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],7:["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],8:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],9:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]},Reds:{3:["#fee0d2","#fc9272","#de2d26"],4:["#fee5d9","#fcae91","#fb6a4a","#cb181d"],5:["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],6:["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],7:["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],8:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],9:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]},Greys:{3:["#f0f0f0","#bdbdbd","#636363"],4:["#f7f7f7","#cccccc","#969696","#525252"],5:["#f7f7f7","#cccccc","#969696","#636363","#252525"],6:["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],7:["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],8:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],9:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]},PuOr:{3:["#f1a340","#f7f7f7","#998ec3"],4:["#e66101","#fdb863","#b2abd2","#5e3c99"],5:["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],6:["#b35806","#f1a340","#fee0b6","#d8daeb","#998ec3","#542788"],7:["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"],8:["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"],9:["#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788"],10:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],11:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"]},BrBG:{3:["#d8b365","#f5f5f5","#5ab4ac"],4:["#a6611a","#dfc27d","#80cdc1","#018571"],5:["#a6611a","#dfc27d","#f5f5f5","#80cdc1","#018571"],6:["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],7:["#8c510a","#d8b365","#f6e8c3","#f5f5f5","#c7eae5","#5ab4ac","#01665e"],8:["#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e"],9:["#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e"],10:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],11:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]},PRGn:{3:["#af8dc3","#f7f7f7","#7fbf7b"],4:["#7b3294","#c2a5cf","#a6dba0","#008837"],5:["#7b3294","#c2a5cf","#f7f7f7","#a6dba0","#008837"],6:["#762a83","#af8dc3","#e7d4e8","#d9f0d3","#7fbf7b","#1b7837"],7:["#762a83","#af8dc3","#e7d4e8","#f7f7f7","#d9f0d3","#7fbf7b","#1b7837"],8:["#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"],9:["#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837"],10:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],11:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"]},PiYG:{3:["#e9a3c9","#f7f7f7","#a1d76a"],4:["#d01c8b","#f1b6da","#b8e186","#4dac26"],5:["#d01c8b","#f1b6da","#f7f7f7","#b8e186","#4dac26"],6:["#c51b7d","#e9a3c9","#fde0ef","#e6f5d0","#a1d76a","#4d9221"],7:["#c51b7d","#e9a3c9","#fde0ef","#f7f7f7","#e6f5d0","#a1d76a","#4d9221"],8:["#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221"],9:["#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221"],10:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],11:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"]},RdBu:{3:["#ef8a62","#f7f7f7","#67a9cf"],4:["#ca0020","#f4a582","#92c5de","#0571b0"],5:["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"],6:["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],7:["#b2182b","#ef8a62","#fddbc7","#f7f7f7","#d1e5f0","#67a9cf","#2166ac"],8:["#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac"],9:["#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac"],10:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],11:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]},RdGy:{3:["#ef8a62","#ffffff","#999999"],4:["#ca0020","#f4a582","#bababa","#404040"],5:["#ca0020","#f4a582","#ffffff","#bababa","#404040"],6:["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],7:["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"],8:["#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d"],9:["#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d"],10:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],11:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"]},RdYlBu:{3:["#fc8d59","#ffffbf","#91bfdb"],4:["#d7191c","#fdae61","#abd9e9","#2c7bb6"],5:["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],6:["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],7:["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],8:["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],9:["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],10:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],11:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]},Spectral:{3:["#fc8d59","#ffffbf","#99d594"],4:["#d7191c","#fdae61","#abdda4","#2b83ba"],5:["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],6:["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],7:["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],8:["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],9:["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],10:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],11:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]},RdYlGn:{3:["#fc8d59","#ffffbf","#91cf60"],4:["#d7191c","#fdae61","#a6d96a","#1a9641"],5:["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"],6:["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],7:["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"],8:["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850"],9:["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"],10:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],11:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]},Accent:{3:["#7fc97f","#beaed4","#fdc086"],4:["#7fc97f","#beaed4","#fdc086","#ffff99"],5:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0"],6:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f"],7:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17"],8:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]},Dark2:{3:["#1b9e77","#d95f02","#7570b3"],4:["#1b9e77","#d95f02","#7570b3","#e7298a"],5:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"],6:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"],7:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],8:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]},Paired:{3:["#a6cee3","#1f78b4","#b2df8a"],4:["#a6cee3","#1f78b4","#b2df8a","#33a02c"],5:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"],6:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c"],7:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f"],8:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00"],9:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"],10:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"],11:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99"],12:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]},Pastel1:{3:["#fbb4ae","#b3cde3","#ccebc5"],4:["#fbb4ae","#b3cde3","#ccebc5","#decbe4"],5:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6"],6:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"],7:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd"],8:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec"],9:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]},Pastel2:{3:["#b3e2cd","#fdcdac","#cbd5e8"],4:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4"],5:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9"],6:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae"],7:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc"],8:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"]},Set1:{3:["#e41a1c","#377eb8","#4daf4a"],4:["#e41a1c","#377eb8","#4daf4a","#984ea3"],5:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"],6:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"],7:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628"],8:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf"],9:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]},Set2:{3:["#66c2a5","#fc8d62","#8da0cb"],4:["#66c2a5","#fc8d62","#8da0cb","#e78ac3"],5:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"],6:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"],7:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"],8:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]},Set3:{3:["#8dd3c7","#ffffb3","#bebada"],4:["#8dd3c7","#ffffb3","#bebada","#fb8072"],5:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3"],6:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462"],7:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"],8:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5"],9:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9"],10:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd"],11:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5"],12:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]}},a=function(f,d){return c[f][d].map((function(e,b){return f+" q"+b+"-"+d}))};e.n(b).a.api.colorBrewers.add("tauBrewer",a),d.default=a;}})})); 
	} (colorBrewer$1, colorBrewer$1.exports));
	return colorBrewer$1.exports;
}

var colorBrewerExports = requireColorBrewer();
var tauBrewer = /*@__PURE__*/getDefaultExportFromCjs(colorBrewerExports);

const kortxyzTauchartCss = "/*! tailwindcss v4.1.11 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,::backdrop,:after,:before{--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000}}}@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}::file-selector-button{appearance:button;background-color:#0000;border:0 solid;border-radius:0;box-sizing:border-box;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;margin:0;margin-inline-end:4px;opacity:1;padding:0}:host,html{-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);tab-size:4;-webkit-tap-highlight-color:transparent;line-height:1.5}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}button,input,optgroup,select,textarea{background-color:#0000;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:currentColor;color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex;padding-block:0}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field{padding-block:0}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}} /*! tailwindcss v4.1.11 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,::backdrop,:after,:before{--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000}}}@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{}@layer components;:host{display:block}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}";

const tauchartsMinCss = "/*! tailwindcss v4.1.11 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,::backdrop,:after,:before{--tw-ring-offset-width:0px;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000}}}@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}::file-selector-button{appearance:button;background-color:#0000;border:0 solid;border-radius:0;box-sizing:border-box;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;margin:0;margin-inline-end:4px;opacity:1;padding:0}:host,html{-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);tab-size:4;-webkit-tap-highlight-color:transparent;line-height:1.5}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}button,input,optgroup,select,textarea{background-color:#0000;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:currentColor;color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex;padding-block:0}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field{padding-block:0}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}} /*! tailwindcss v4.1.11 | MIT License | https://tailwindcss.com */@layer properties{}@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{}@layer components;@layer utilities{@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.container{width:100%}.block{display:block}.grid{display:grid}.hidden{display:none}.inline{display:inline}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.resize{resize:both}.border{border-style:var(--tw-border-style);border-width:1px}.uppercase{text-transform:uppercase}.italic{font-style:italic}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.underline{text-decoration-line:underline}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.invert\\!{--tw-invert:invert(100%)!important;filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)!important}.filter{filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}.tau-chart__layout{align-items:stretch;background:0 0;color:#333;display:-webkit-box;display:-webkit-flexbox;display:flex;flex-direction:column;font-family:Helvetica Neue,Segoe UI,Open Sans,Ubuntu,sans-serif;height:100%;line-height:1;overflow:auto;width:100%}.tau-chart__layout text{fill:#333;font:13px Helvetica Neue,Segoe UI,Open Sans,Ubuntu,sans-serif}.tau-chart__chart{font-family:Helvetica Neue,Segoe UI,Open Sans,Ubuntu,sans-serif;height:100%;overflow:auto;position:absolute;width:100%}.tau-chart__layout__header{-ms-flex:0 .1 auto;-webkit-box-flex:0 .1 auto;flex:0 .1 auto;position:relative}.tau-chart__layout__container{display:-webkit-box;display:-webkit-flexbox;-ms-flex:auto;-webkit-box-flex:1 1 auto;display:flex;flex:auto;height:100%}.tau-chart__layout__footer,.tau-chart__layout__sidebar{-ms-flex:0 auto;-webkit-box-flex:0 1 auto;flex:0 auto}.tau-chart__layout__content{-ms-flex:auto;-webkit-box-flex:1 1 auto;flex:auto;overflow:hidden}.tau-chart__layout__sidebar-right{-ms-flex:none;-webkit-box-flex:0 0 auto;flex:none;overflow:hidden;position:relative}.tau-chart__layout__sidebar-right__wrap{box-sizing:border-box;max-height:100%}.tau-chart__layout.tau-chart__layout_rendering-error{opacity:.75}.tau-chart__rendering-timeout-warning{align-items:center;background:#ffffff80;display:flex;flex-direction:column;height:100%;position:absolute;top:0;width:100%}.tau-chart__rendering-timeout-warning svg{height:100%;max-width:32em;width:100%}.tau-chart__rendering-timeout-warning text{font-weight:300}.tau-chart__progress{box-sizing:border-box;height:.25em;opacity:0;overflow:hidden;pointer-events:none;position:absolute;top:0;transition:opacity 1s .75s;width:100%}.tau-chart__progress_active{opacity:1}.tau-chart__progress__value{background:#33333340;height:100%;transition:width .75s}.tau-chart__checkbox{display:block;position:relative}.tau-chart__checkbox__input{opacity:0;position:absolute;z-index:-1}.tau-chart__checkbox__icon{background:linear-gradient(#fff,#dbdbde);border:1px solid #c3c3c3;border-radius:2px;display:inline-block;height:14px;position:relative;top:3px;width:14px}.tau-chart__checkbox__icon:before{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAFoTx1HAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEQ4M0RDOTE4NDQ2MTFFNEE5RTdBRERDQzRBQzNEMTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEQ4M0RDOTI4NDQ2MTFFNEE5RTdBRERDQzRBQzNEMTQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowRDgzREM4Rjg0NDYxMUU0QTlFN0FERENDNEFDM0QxNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowRDgzREM5MDg0NDYxMUU0QTlFN0FERENDNEFDM0QxNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn2UjdoAAAEGSURBVHjaYvz//z8DGIAYSUlJdwECiBEukpiY/BDEAQggBrgIVBkLjAEDAAHEiMyBywBNOwDmJCYm/cdQBhBAqHrQAUgSojV5P8QtSY+A+D7cPTDdMAUwTQABhNdYJgZ8AF1nRkaGAgjDvQzi/AOCP3+YWX7+/HmXiYlRAcXY37//AEPs511OTg65uXPnPkQxNi0tTTklJUWGaNcCBBj+EMIDmBjIBCwo1jMyYigAul/x79//B4CulwOqODBv3hxHDKcmJycfAHLtgfrvMTExJf/7938xUF4GaOB9FhZmh1mzZj2CqUdNEkAdSUmZSsAgBNrAIAsUAQYlu+O0adMeo0cS/QMHAGJZps83N5ZDAAAAAElFTkSuQmCC);content:\"\";display:none;height:100%;left:0;position:absolute;top:0;width:100%}.tau-chart__checkbox__text{margin-left:5px}.tau-chart__checkbox__input~.tau-chart__checkbox__text{cursor:pointer}.tau-chart__checkbox__input:disabled~.tau-chart__checkbox__text{cursor:default;opacity:.3}.tau-chart__checkbox__input:not(:disabled):focus+.tau-chart__checkbox__icon{box-shadow:0 0 0 1px #0000004d,0 0 7px #52a8ec;outline:none}.tau-chart__checkbox:hover .tau-chart__checkbox__input:not(:disabled)~.tau-chart__checkbox__icon{border-color:#999}.tau-chart__checkbox__input:checked+.tau-chart__checkbox__icon{background:linear-gradient(#fff,#dbdbde)}.tau-chart__checkbox__input:checked+.tau-chart__checkbox__icon:before{display:block}.tau-chart__select{background-color:#fff;border:1px solid #c3c3c3;border-radius:2px;color:#333;display:inline-block;font-family:inherit;font-size:13px;height:24px;line-height:24px;padding:2px;vertical-align:middle}.tau-chart__select:focus{box-shadow:0 0 0 1px #0000004d,0 0 7px #52a8ec;outline:none}.tau-chart__select[disabled]{cursor:default;opacity:.3}.tau-chart__select[multiple]{height:auto}.tau-chart__select option[disabled]{opacity:.6}.tau-chart__button{background-color:#ffffffe6;border:1px solid;border-radius:4px;box-shadow:0 0 1px #0000001a;box-sizing:border-box;color:#b3b3b3;cursor:pointer;font-size:13px;height:calc(1.5em + 2px);line-height:1.5em;padding:0 6px}.tau-chart__button:hover{border-color:#999;color:#333}.tau-chart__svg .color20-1{stroke:#6fa1d9;fill:#6fa1d9}.tau-chart__svg .color20-2{stroke:#df2b59;fill:#df2b59}.tau-chart__svg .color20-3{stroke:#66da26;fill:#66da26}.tau-chart__svg .color20-4{stroke:#4c3862;fill:#4c3862}.tau-chart__svg .color20-5{stroke:#e5b011;fill:#e5b011}.tau-chart__svg .color20-6{stroke:#3a3226;fill:#3a3226}.tau-chart__svg .color20-7{stroke:#cb461a;fill:#cb461a}.tau-chart__svg .color20-8{stroke:#c7ce23;fill:#c7ce23}.tau-chart__svg .color20-9{stroke:#7fcdc2;fill:#7fcdc2}.tau-chart__svg .color20-10{stroke:#cca1c8;fill:#cca1c8}.tau-chart__svg .color20-11{stroke:#c84cce;fill:#c84cce}.tau-chart__svg .color20-12{stroke:#54762e;fill:#54762e}.tau-chart__svg .color20-13{stroke:#746bc9;fill:#746bc9}.tau-chart__svg .color20-14{stroke:#953441;fill:#953441}.tau-chart__svg .color20-15{stroke:#5c7a76;fill:#5c7a76}.tau-chart__svg .color20-16{stroke:#c8bf87;fill:#c8bf87}.tau-chart__svg .color20-17{stroke:#bfc1c3;fill:#bfc1c3}.tau-chart__svg .color20-18{stroke:#8e5c31;fill:#8e5c31}.tau-chart__svg .color20-19{stroke:#71ce7b;fill:#71ce7b}.tau-chart__svg .color20-20{stroke:#be478b;fill:#be478b}.tau-chart__svg .color-default{stroke:#6fa1d9;fill:#6fa1d9}.tau-chart__line-width-1{stroke-width:1px}.tau-chart__line-width-2{stroke-width:1.5px}.tau-chart__line-width-3{stroke-width:2px}.tau-chart__line-width-4{stroke-width:2.5px}.tau-chart__line-width-5{stroke-width:3px}.tau-chart__line-opacity-1{stroke-opacity:1}.tau-chart__line-opacity-2{stroke-opacity:.95}.tau-chart__line-opacity-3{stroke-opacity:.9}.tau-chart__line-opacity-4{stroke-opacity:.85}.tau-chart__line-opacity-5{stroke-opacity:.8}.tau-chart a{border-bottom:1px solid #3962ff4d;color:#3962ff;text-decoration:none}.tau-chart a:hover{border-bottom:1px solid #e171524d;color:#e17152}.tau-chart__time-axis-overflow .tick:nth-child(2n){display:none}.tau-chart__svg{display:block;overflow:hidden}.tau-chart__svg .place{fill:#fff;stroke:#000;stroke-opacity:.7;stroke-width:.5px}.tau-chart__svg .place-label{color:#000;opacity:.7;text-anchor:start;font-size:11px;line-height:13px}.tau-chart__svg .place-label-countries,.tau-chart__svg .place-label-states,.tau-chart__svg .place-label-subunits{text-anchor:middle;fill:#33333380;font-size:10px;line-height:10px;text-transform:capitalize}.tau-chart__svg .map-contour-level path{stroke-opacity:.5;stroke-linejoin:\"round\"}.tau-chart__svg .map-contour-level-0 path,.tau-chart__svg .map-contour-level-1 path,.tau-chart__svg .map-contour-level-2 path,.tau-chart__svg .map-contour-level-3 path,.tau-chart__svg .map-contour-level-4 path{stroke:#fff}.tau-chart__svg .map-contour-highlighted,.tau-chart__svg .map-contour:hover{fill:#ffbf00}.tau-chart__svg .map-contour-highlighted path,.tau-chart__svg .map-contour:hover path{stroke:#fff}.tau-chart__svg .map-contour-highlighted text,.tau-chart__svg .map-contour:hover text{fill:#000}.tau-chart__svg .axis line,.tau-chart__svg .axis path{stroke-width:1px;fill:none;stroke:#bdc3cd66;shape-rendering:crispEdges}.tau-chart__svg .axis.facet-axis .tick line{opacity:0}.tau-chart__svg .axis.facet-axis .tick line.label-ref{opacity:1}.tau-chart__svg .axis.facet-axis .tick text{font-size:12px;font-weight:600}.tau-chart__svg .axis.facet-axis path.domain{opacity:0}.tau-chart__svg .axis.facet-axis.compact .label,.tau-chart__svg .axis.facet-axis.compact .label .label-token,.tau-chart__svg .axis.facet-axis.compact .tick text{font-weight:400}.tau-chart__svg .tick text{font-size:11px}.tau-chart__svg .grid .grid-lines path{shape-rendering:crispEdges}.tau-chart__svg .grid .line path,.tau-chart__svg .grid path.domain,.tau-chart__svg .grid path.line{fill:none}.tau-chart__svg .grid .extra-tick-line,.tau-chart__svg .grid .tick>line{fill:none;stroke:#bdc3cd66;stroke-width:1px;shape-rendering:crispEdges}.tau-chart__svg .grid .tick.zero-tick>line{stroke:#7e818681}.tau-chart__svg .grid .line path{shape-rendering:auto}.tau-chart__svg .grid .cursor-line{shape-rendering:crispEdges;stroke:#adadad;stroke-width:1px}.tau-chart__svg .label{font-size:12px;font-weight:600}.tau-chart__svg .label .label-token{font-size:12px;font-weight:600;text-transform:capitalize}.tau-chart__svg .label .label-token-1,.tau-chart__svg .label .label-token-2{font-weight:400}.tau-chart__svg .label .label-token-2{fill:gray}.tau-chart__svg .label .label-token-delimiter{fill:gray;font-weight:400}.tau-chart__svg .label.inline .label-token{fill:gray;font-weight:400;text-transform:none}.tau-chart__svg .brush .selection{fill-opacity:.3;stroke:#fff;shape-rendering:crispEdges}.tau-chart__svg .background{stroke:#f2f2f2}.tau-chart__dot{opacity:.7;stroke-width:0;transition:stroke-width .1s,opacity .2s}.tau-chart__line{fill:none;transition:stroke-opacity .2s,stroke-width .2s}.tau-chart__dot-line{opacity:1;transition:stroke-opacity .2s}.tau-chart__bar{opacity:.7;shape-rendering:geometricPrecision;stroke-opacity:.5;stroke-width:1px;stroke:#fff}.tau-chart__area,.tau-chart__bar{transition:opacity .2s}.tau-chart__area path:not(.i-data-anchor),.tau-chart__area polygon{opacity:.6;transition:stroke-opacity .2s,stroke-width .2s}.tau-chart__svg .tau-chart__bar{stroke:#fff}.tau-chart__dot.tau-chart__highlighted{stroke-width:1px;opacity:1}.tau-chart__dot.tau-chart__dimmed{opacity:.2}.tau-chart__line.tau-chart__highlighted{stroke-opacity:1;stroke-width:3px}.tau-chart__line.tau-chart__dimmed{stroke-opacity:.2}.i-role-label.tau-chart__highlighted,.tau-chart__area.tau-chart__highlighted,.tau-chart__bar.tau-chart__highlighted{stroke-opacity:1;opacity:1}.i-role-label.tau-chart__dimmed,.tau-chart__area.tau-chart__dimmed,.tau-chart__bar.tau-chart__dimmed{opacity:.2}.tau-chart__annotation-line{stroke-width:2px;stroke-dasharray:1 1;shape-rendering:crispEdges}.tau-chart__annotation-area.tau-chart__area polygon{opacity:.1}.tau-chart__category-filter{box-sizing:border-box;margin-right:30px;padding:20px 0 10px 10px;width:160px}.tau-chart__category-filter__category__label{font-size:13px;font-weight:600;margin:0 0 10px 10px;text-transform:capitalize}.tau-chart__category-filter__category__values{margin-bottom:10px}.tau-chart__category-filter__value{align-items:center;color:#ccc;cursor:pointer;display:flex;flex-direction:row;font-size:13px;width:100%}.tau-chart__category-filter__value:hover{background-color:#bdc3cd33}.tau-chart__category-filter__value_checked{color:#333}.tau-chart__category-filter__value__toggle{flex:none;padding:10px 10px 8px}.tau-chart__category-filter__value__toggle__icon{background-color:#0000;border:1px solid #8694a3;border-radius:50%;box-sizing:border-box;display:inline-block;height:16px;pointer-events:none;position:relative;width:16px}.tau-chart__category-filter__value__toggle__icon:after,.tau-chart__category-filter__value__toggle__icon:before{background-color:#333;content:\"\";display:block;opacity:0;position:absolute}.tau-chart__category-filter__value__toggle__icon:before{height:2px;left:3px;top:6px;width:8px}.tau-chart__category-filter__value__toggle__icon:after{height:8px;left:6px;top:3px;width:2px}.tau-chart__category-filter__value__toggle:hover .tau-chart__category-filter__value__toggle__icon:after,.tau-chart__category-filter__value__toggle:hover .tau-chart__category-filter__value__toggle__icon:before{opacity:1}.tau-chart__category-filter__value_checked .tau-chart__category-filter__value__toggle__icon{background-color:#8694a3;border-color:#0000}.tau-chart__category-filter__value_checked .tau-chart__category-filter__value__toggle__icon:after,.tau-chart__category-filter__value_checked .tau-chart__category-filter__value__toggle__icon:before{background-color:#fff;transform:rotate(45deg)}.tau-chart__category-filter__value__label{padding-left:4px}.tau-chart__layout .tau-crosshair__line{shape-rendering:crispEdges;stroke-dasharray:1 1;stroke-width:1px}.tau-chart__layout .tau-crosshair__label__text{fill:#fff;stroke:none}.tau-chart__layout .tau-crosshair__label__text,.tau-chart__layout .tau-crosshair__label__text-shadow{font-size:12px;font-weight:400}.tau-chart__layout .tau-crosshair__line-shadow{shape-rendering:crispEdges;stroke:#ccc;stroke-width:1px}.tau-chart__layout .tau-crosshair__group.y .tau-crosshair__line-shadow{transform:translate(-.5px)}.tau-chart__layout .tau-crosshair__group.x .tau-crosshair__line-shadow{transform:translateY(.5px)}.tau-chart__layout .tau-crosshair__label__text-shadow{stroke-linejoin:round;stroke-width:3px;visibility:hidden}.tau-chart__layout .tau-crosshair__label__box{fill-opacity:.85;rx:3px;ry:3px;stroke:none}.tau-chart__layout .tau-crosshair__label.color20-1 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-1{stroke:#6fa1d9}.tau-chart__layout .tau-crosshair__label.color20-1 .tau-crosshair__label__box{fill:#6fa1d9}.tau-chart__layout .tau-crosshair__label.color20-2 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-2{stroke:#df2b59}.tau-chart__layout .tau-crosshair__label.color20-2 .tau-crosshair__label__box{fill:#df2b59}.tau-chart__layout .tau-crosshair__label.color20-3 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-3{stroke:#66da26}.tau-chart__layout .tau-crosshair__label.color20-3 .tau-crosshair__label__box{fill:#66da26}.tau-chart__layout .tau-crosshair__label.color20-4 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-4{stroke:#4c3862}.tau-chart__layout .tau-crosshair__label.color20-4 .tau-crosshair__label__box{fill:#4c3862}.tau-chart__layout .tau-crosshair__label.color20-5 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-5{stroke:#e5b011}.tau-chart__layout .tau-crosshair__label.color20-5 .tau-crosshair__label__box{fill:#e5b011}.tau-chart__layout .tau-crosshair__label.color20-6 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-6{stroke:#3a3226}.tau-chart__layout .tau-crosshair__label.color20-6 .tau-crosshair__label__box{fill:#3a3226}.tau-chart__layout .tau-crosshair__label.color20-7 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-7{stroke:#cb461a}.tau-chart__layout .tau-crosshair__label.color20-7 .tau-crosshair__label__box{fill:#cb461a}.tau-chart__layout .tau-crosshair__label.color20-8 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-8{stroke:#c7ce23}.tau-chart__layout .tau-crosshair__label.color20-8 .tau-crosshair__label__box{fill:#c7ce23}.tau-chart__layout .tau-crosshair__label.color20-9 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-9{stroke:#7fcdc2}.tau-chart__layout .tau-crosshair__label.color20-9 .tau-crosshair__label__box{fill:#7fcdc2}.tau-chart__layout .tau-crosshair__label.color20-10 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-10{stroke:#cca1c8}.tau-chart__layout .tau-crosshair__label.color20-10 .tau-crosshair__label__box{fill:#cca1c8}.tau-chart__layout .tau-crosshair__label.color20-11 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-11{stroke:#c84cce}.tau-chart__layout .tau-crosshair__label.color20-11 .tau-crosshair__label__box{fill:#c84cce}.tau-chart__layout .tau-crosshair__label.color20-12 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-12{stroke:#54762e}.tau-chart__layout .tau-crosshair__label.color20-12 .tau-crosshair__label__box{fill:#54762e}.tau-chart__layout .tau-crosshair__label.color20-13 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-13{stroke:#746bc9}.tau-chart__layout .tau-crosshair__label.color20-13 .tau-crosshair__label__box{fill:#746bc9}.tau-chart__layout .tau-crosshair__label.color20-14 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-14{stroke:#953441}.tau-chart__layout .tau-crosshair__label.color20-14 .tau-crosshair__label__box{fill:#953441}.tau-chart__layout .tau-crosshair__label.color20-15 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-15{stroke:#5c7a76}.tau-chart__layout .tau-crosshair__label.color20-15 .tau-crosshair__label__box{fill:#5c7a76}.tau-chart__layout .tau-crosshair__label.color20-16 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-16{stroke:#c8bf87}.tau-chart__layout .tau-crosshair__label.color20-16 .tau-crosshair__label__box{fill:#c8bf87}.tau-chart__layout .tau-crosshair__label.color20-17 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-17{stroke:#bfc1c3}.tau-chart__layout .tau-crosshair__label.color20-17 .tau-crosshair__label__box{fill:#bfc1c3}.tau-chart__layout .tau-crosshair__label.color20-18 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-18{stroke:#8e5c31}.tau-chart__layout .tau-crosshair__label.color20-18 .tau-crosshair__label__box{fill:#8e5c31}.tau-chart__layout .tau-crosshair__label.color20-19 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-19{stroke:#71ce7b}.tau-chart__layout .tau-crosshair__label.color20-19 .tau-crosshair__label__box{fill:#71ce7b}.tau-chart__layout .tau-crosshair__label.color20-20 .tau-crosshair__label__text-shadow,.tau-chart__layout .tau-crosshair__line.color20-20{stroke:#be478b}.tau-chart__layout .tau-crosshair__label.color20-20 .tau-crosshair__label__box{fill:#be478b}.diff-tooltip__table{border-top:1px solid #3333;margin-top:5px;padding-top:5px;width:calc(100% + 15px)}.diff-tooltip__header{align-items:stretch;display:flex;font-weight:600;justify-content:space-between;padding:2px 0;position:relative}.diff-tooltip__header__text{justify-content:flex-start}.diff-tooltip__header__text,.diff-tooltip__header__value{align-items:center;display:inline-flex;flex:auto;max-width:120px}.diff-tooltip__header__value{justify-content:flex-end;margin-right:15px;padding-left:10px;text-align:right}.diff-tooltip__header__updown{align-items:center;display:inline-flex;flex:auto;font-size:75%;height:100%;justify-content:flex-start;padding-left:2px;position:absolute;right:0;visibility:hidden}.diff-tooltip__body{max-height:250px;overflow:hidden;padding:1px;position:relative}.diff-tooltip__body__content{padding-bottom:1px}.diff-tooltip__body_overflow-bottom:after,.diff-tooltip__body_overflow-top:before{align-items:center;color:#333333b3;content:\"...\";display:flex;flex-direction:column;height:26px;left:0;position:absolute;width:100%;z-index:2}.diff-tooltip__body_overflow-top:before{background:linear-gradient(#fff,#fff0);justify-content:flex-start;top:0}.diff-tooltip__body_overflow-bottom:after{background:linear-gradient(#fff0,#fff);bottom:0;justify-content:flex-end}.diff-tooltip__item{display:flex;justify-content:space-between;margin-right:15px;min-width:100px;position:relative}.diff-tooltip__item_highlighted{background-color:#f1e9ff80;box-shadow:0 0 0 1px #877aa1;z-index:1}.diff-tooltip__item__bg{align-items:center;display:inline-flex;height:100%;justify-content:center;min-width:3px;opacity:.6;position:absolute;z-index:0}.diff-tooltip__item__text{flex:auto;overflow:hidden;padding:2px 4px;text-overflow:ellipsis;white-space:nowrap;width:100%;z-index:1}.diff-tooltip__item__value{display:table-cell;flex:none;padding:2px 4px 2px 30px;z-index:1}.diff-tooltip__item__updown{align-items:center;display:inline-flex;flex:4;height:100%;justify-content:flex-start;left:100%;padding:0 4px;position:absolute}.diff-tooltip__item__updown_positive{color:#4ca383}.diff-tooltip__item__updown_negative{color:#df6772}.diff-tooltip__field__updown_positive{color:#4ca383}.diff-tooltip__field__updown_negative{color:#df6772}.interval-highlight__range{shape-rendering:crispEdges}.interval-highlight__range-start{shape-rendering:crispEdges;stroke:#b8aecb;stroke-dasharray:2 1}.interval-highlight__range-end{shape-rendering:crispEdges;stroke:#b8aecb}.interval-highlight__gradient-start{stop-color:#c4b3e6;stop-opacity:.02}.interval-highlight__gradient-end{stop-color:#c4b3e6;stop-opacity:.2}.diff-tooltip__item__bg.color20-1{background-color:#6fa1d9}.diff-tooltip__item__bg.color20-2{background-color:#df2b59}.diff-tooltip__item__bg.color20-3{background-color:#66da26}.diff-tooltip__item__bg.color20-4{background-color:#4c3862}.diff-tooltip__item__bg.color20-5{background-color:#e5b011}.diff-tooltip__item__bg.color20-6{background-color:#3a3226}.diff-tooltip__item__bg.color20-7{background-color:#cb461a}.diff-tooltip__item__bg.color20-8{background-color:#c7ce23}.diff-tooltip__item__bg.color20-9{background-color:#7fcdc2}.diff-tooltip__item__bg.color20-10{background-color:#cca1c8}.diff-tooltip__item__bg.color20-11{background-color:#c84cce}.diff-tooltip__item__bg.color20-12{background-color:#54762e}.diff-tooltip__item__bg.color20-13{background-color:#746bc9}.diff-tooltip__item__bg.color20-14{background-color:#953441}.diff-tooltip__item__bg.color20-15{background-color:#5c7a76}.diff-tooltip__item__bg.color20-16{background-color:#c8bf87}.diff-tooltip__item__bg.color20-17{background-color:#bfc1c3}.diff-tooltip__item__bg.color20-18{background-color:#8e5c31}.diff-tooltip__item__bg.color20-19{background-color:#71ce7b}.diff-tooltip__item__bg.color20-20{background-color:#be478b}.tau-chart__print-block{display:none}.tau-chart__export{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij48dGl0bGU+ZXhwb3J0PC90aXRsZT48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im0xNyAxLjY3LTguMzI4IDguMzY2TDggOS41IDE2LjM1MyAxSDEyVjBoNnY2aC0xeiIgb3BhY2l0eT0iLjgiLz48cGF0aCBkPSJNMCA1LjAxQTMgMyAwIDAgMSAzLjAxIDJIMTZ2MTIuOTlBMy4wMDMgMy4wMDMgMCAwIDEgMTIuOTkgMThIMy4wMUEzIDMgMCAwIDEgMCAxNC45OXpNMTUgMTVjMCAxLjEwNS0uODk3IDItMi4wMDYgMkgzLjAwNkEyLjAwNSAyLjAwNSAwIDAgMSAxIDE0Ljk5NFY1LjAwNkMxIDMuODk4IDEuODg3IDMgMi45OTggM0g5VjJoN3Y3aC0xdjYuMDAyeiIgb3BhY2l0eT0iLjQiLz48L2c+PC9zdmc+);background-repeat:no-repeat;color:#0000;cursor:pointer;display:block;float:right;height:20px;margin:0 20px 0 0;opacity:.6;overflow:hidden;position:relative;text-decoration:none;text-indent:20px;width:20px;z-index:2}.tau-chart__export:hover{opacity:1;text-decoration:none}.tau-chart__export__list{font-size:11px;margin:0;padding:0}.tau-chart__export__item{box-sizing:border-box;overflow:hidden}.tau-chart__export__item>a{color:inherit;cursor:pointer;display:block;padding:7px 15px;text-decoration:none}.tau-chart__export__item>a:focus,.tau-chart__export__item>a:hover{background:#eaf2fc;box-shadow:none;outline:none}.tau-chart__legend{box-sizing:border-box;margin-right:30px;padding:20px 0 10px 10px;position:relative;width:160px}.tau-chart__legend__wrap{margin-bottom:30px;position:relative}.tau-chart__legend__wrap:last-child{margin-bottom:0}.tau-chart__legend__title{font-size:13px;font-weight:600;margin:0 0 10px 10px;text-transform:capitalize}.tau-chart__legend__reset{margin-top:-4px;position:absolute;right:-25px;top:0;z-index:1}.tau-chart__legend__reset.disabled{display:none}.tau-chart__legend__reset+.tau-chart__legend__title{margin-right:1.7em}.tau-chart__legend__item{cursor:pointer;font-size:13px;line-height:1.2em;padding:10px 20px 8px 40px;position:relative}.tau-chart__legend__item:hover{background-color:#bdc3cd33}.tau-chart__legend__item--size{cursor:default}.tau-chart__legend__item--size:hover{background:0 0}.tau-chart__legend__item .color-default{background:#6fa1d9;border-color:#6fa1d9}.tau-chart__legend__item.disabled,.tau-chart__legend__item:disabled{color:#ccc}.tau-chart__legend__item.disabled .tau-chart__legend__guide{background:0 0}.tau-chart__legend__guide{border:1px solid #0000;border-radius:50%;box-sizing:border-box;height:100%;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:100%}.tau-chart__legend__guide__wrap{height:16px;left:10px;position:absolute;top:calc(2px + .6em);width:16px}.tau-chart__legend__guide--size{stroke:#6fa1d9;fill:#6fa1d9}.tau-chart__legend__guide--color__overlay{background-color:#0000;height:36px;left:-12px;position:absolute;top:-12px;width:36px}.tau-chart__legend__guide--color:before{content:\"\";display:none;height:2px;left:3px;pointer-events:none;position:absolute;top:6px;width:8px}.tau-chart__legend__guide--color:after{content:\"\";display:none;height:8px;left:6px;pointer-events:none;position:absolute;top:3px;width:2px}.tau-chart__legend__item .tau-chart__legend__guide--color:hover:after,.tau-chart__legend__item .tau-chart__legend__guide--color:hover:before{background-color:#fff;display:inline-block;transform:rotate(45deg)}.tau-chart__legend__item.disabled .tau-chart__legend__guide--color:hover{background:#fff}.tau-chart__legend__item.disabled .tau-chart__legend__guide--color:hover:after,.tau-chart__legend__item.disabled .tau-chart__legend__guide--color:hover:before{background-color:#333;transform:none}.tau-chart__legend__gradient-wrapper,.tau-chart__legend__size-wrapper{box-sizing:border-box;margin:10px;overflow:visible;width:100%}.tau-chart__legend__gradient,.tau-chart__legend__size{overflow:visible}.tau-chart__legend__size__item__circle.color-definite{stroke:#cacaca;fill:#cacaca}.tau-chart__legend__size__item__circle.color-default-size{stroke:#6fa1d9;fill:#6fa1d9}.tau-chart__legend__gradient__bar{rx:4px;ry:4px}.tau-chart__legend__item .color20-1{background:#6fa1d9;border:1px solid #6fa1d9}.tau-chart__legend__item.disabled .color20-1{background-color:#0000}.tau-chart__legend__item .color20-2{background:#df2b59;border:1px solid #df2b59}.tau-chart__legend__item.disabled .color20-2{background-color:#0000}.tau-chart__legend__item .color20-3{background:#66da26;border:1px solid #66da26}.tau-chart__legend__item.disabled .color20-3{background-color:#0000}.tau-chart__legend__item .color20-4{background:#4c3862;border:1px solid #4c3862}.tau-chart__legend__item.disabled .color20-4{background-color:#0000}.tau-chart__legend__item .color20-5{background:#e5b011;border:1px solid #e5b011}.tau-chart__legend__item.disabled .color20-5{background-color:#0000}.tau-chart__legend__item .color20-6{background:#3a3226;border:1px solid #3a3226}.tau-chart__legend__item.disabled .color20-6{background-color:#0000}.tau-chart__legend__item .color20-7{background:#cb461a;border:1px solid #cb461a}.tau-chart__legend__item.disabled .color20-7{background-color:#0000}.tau-chart__legend__item .color20-8{background:#c7ce23;border:1px solid #c7ce23}.tau-chart__legend__item.disabled .color20-8{background-color:#0000}.tau-chart__legend__item .color20-9{background:#7fcdc2;border:1px solid #7fcdc2}.tau-chart__legend__item.disabled .color20-9{background-color:#0000}.tau-chart__legend__item .color20-10{background:#cca1c8;border:1px solid #cca1c8}.tau-chart__legend__item.disabled .color20-10{background-color:#0000}.tau-chart__legend__item .color20-11{background:#c84cce;border:1px solid #c84cce}.tau-chart__legend__item.disabled .color20-11{background-color:#0000}.tau-chart__legend__item .color20-12{background:#54762e;border:1px solid #54762e}.tau-chart__legend__item.disabled .color20-12{background-color:#0000}.tau-chart__legend__item .color20-13{background:#746bc9;border:1px solid #746bc9}.tau-chart__legend__item.disabled .color20-13{background-color:#0000}.tau-chart__legend__item .color20-14{background:#953441;border:1px solid #953441}.tau-chart__legend__item.disabled .color20-14{background-color:#0000}.tau-chart__legend__item .color20-15{background:#5c7a76;border:1px solid #5c7a76}.tau-chart__legend__item.disabled .color20-15{background-color:#0000}.tau-chart__legend__item .color20-16{background:#c8bf87;border:1px solid #c8bf87}.tau-chart__legend__item.disabled .color20-16{background-color:#0000}.tau-chart__legend__item .color20-17{background:#bfc1c3;border:1px solid #bfc1c3}.tau-chart__legend__item.disabled .color20-17{background-color:#0000}.tau-chart__legend__item .color20-18{background:#8e5c31;border:1px solid #8e5c31}.tau-chart__legend__item.disabled .color20-18{background-color:#0000}.tau-chart__legend__item .color20-19{background:#71ce7b;border:1px solid #71ce7b}.tau-chart__legend__item.disabled .color20-19{background-color:#0000}.tau-chart__legend__item .color20-20{background:#be478b;border:1px solid #be478b}.tau-chart__legend__item.disabled .color20-20{background-color:#0000}.tau-chart__filter__wrap{box-sizing:border-box;margin-right:30px;padding:20px 0 10px 10px;width:160px}.tau-chart__filter__wrap__title{font-size:13px;font-weight:600;margin:0 0 10px 10px;text-transform:capitalize}.tau-chart__filter__wrap rect{fill:#0003}.tau-chart__filter__wrap .brush .handle,.tau-chart__filter__wrap .brush .overlay{opacity:0}.tau-chart__filter__wrap .brush .selection{shape-rendering:crispEdges;fill-opacity:.4;fill:#0074ff}.tau-chart__filter__wrap text.date-label{text-anchor:middle;font-size:12px}.tau-chart__filter__wrap text.date-label .common{font-weight:600}.tau-chart__filter__wrap .resize line{stroke:#000;stroke-width:1px;shape-rendering:crispEdges}.tau-chart__filter__wrap .resize.e text,.tau-chart__filter__wrap .resize.w text{text-anchor:middle;font-size:12px}.tau-chart__tooltip{align-items:stretch;background:#ffffffe6;box-shadow:0 1px 4px #0003,0 0 0 1px #00000001;display:flex;flex-direction:column;font-family:Helvetica Neue,Segoe UI,Open Sans,Ubuntu,sans-serif;font-size:11px;left:0;max-width:none;position:absolute;top:0;z-index:900}.tau-chart__tooltip.fade{opacity:0;transition:opacity .2s ease-out}.tau-chart__tooltip.fade.in{opacity:1;transition-duration:.5s}.tau-chart__tooltip.bottom-right,.tau-chart__tooltip.top-right{margin-left:8px}.tau-chart__tooltip.bottom-left,.tau-chart__tooltip.top-left{margin-left:-8px}.tau-chart__tooltip.top,.tau-chart__tooltip.top-left,.tau-chart__tooltip.top-right{margin-top:8px}.tau-chart__tooltip__content{box-sizing:border-box;max-width:500px;min-width:100px;overflow:hidden;padding:15px 15px 10px}.tau-chart__tooltip__buttons{background:#ebeef1;bottom:100%;box-shadow:0 1px 4px #0003,0 0 0 1px #00000001;display:flex;flex-flow:wrap;max-width:500px;min-width:86px;position:absolute;width:100%;z-index:-1}.tau-chart__tooltip__buttons:after{background:linear-gradient(#fff 50%,#fff0);content:\"\";display:block;height:8px;left:0;pointer-events:none;position:absolute;top:100%;width:100%}.tau-chart__tooltip__button{color:#65717f;cursor:pointer;display:inline-flex;flex:1 0 auto;height:0;overflow:hidden;transition:height .5s}.tau-chart__tooltip__button__wrap{line-height:26px;padding:0 15px}.tau-chart__tooltip__button:hover{background:#f5f7f8;color:#333}.tau-chart__tooltip__button .tau-icon-close-gray{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj48cGF0aCBmaWxsPSIjODQ5NmE3IiBkPSJNMTAgLjcxNSA5LjI4NSAwIDUgNC4yODUuNzE1IDAgMCAuNzE1IDQuMjg1IDUgMCA5LjI4NS43MTUgMTAgNSA1LjcxNSA5LjI4NSAxMCAxMCA5LjI4NSA1LjcxNSA1eiIvPjwvc3ZnPg==);display:inline-block;height:12px;margin-right:5px;position:relative;top:3px;width:12px}.tau-chart__tooltip.stuck .tau-chart__tooltip__button{height:26px}.tau-chart__tooltip.top .tau-chart__tooltip__buttons,.tau-chart__tooltip.top-left .tau-chart__tooltip__buttons,.tau-chart__tooltip.top-right .tau-chart__tooltip__buttons{bottom:auto;top:100%}.tau-chart__tooltip.top .tau-chart__tooltip__buttons__wrap,.tau-chart__tooltip.top-left .tau-chart__tooltip__buttons__wrap,.tau-chart__tooltip.top-right .tau-chart__tooltip__buttons__wrap{position:relative;top:calc(100% - 26px)}.tau-chart__tooltip.top .tau-chart__tooltip__buttons:after,.tau-chart__tooltip.top-left .tau-chart__tooltip__buttons:after,.tau-chart__tooltip.top-right .tau-chart__tooltip__buttons:after{background:linear-gradient(#fff0,#fff 50%);bottom:100%;top:auto}.tau-chart__tooltip.top-left .tau-chart__tooltip__button__wrap,.tau-chart__tooltip.top-right .tau-chart__tooltip__button__wrap{position:relative;top:calc(100% - 26px)}.tau-chart__tooltip__list{display:table}.tau-chart__tooltip__list__item{display:table-row}.tau-chart__tooltip__list__elem{color:#000;display:table-cell;line-height:1.3;padding-bottom:4px}.tau-chart__tooltip__list__elem:not(:first-child){padding-left:15px}.tau-chart__tooltip__gray-text,.tau-chart__tooltip__list__elem:first-child{color:#8e8e8e}.tau-chart__tooltip-target{cursor:pointer}.tau-chart__tooltip-target .i-data-anchor.tau-chart__highlighted,.tau-chart__tooltip-target .tau-chart__bar.tau-chart__highlighted,.tau-chart__tooltip-target .tau-chart__dot.tau-chart__highlighted{stroke:#333;stroke-width:1px}.tau-chart__tooltip-target .tau-chart__bar.tau-chart__highlighted{shape-rendering:crispEdges}.tau-chart__svg .tau-chart__trendline.color20-1{stroke:#357ac7}.tau-chart__svg .tau-chart__trendline.color20-2{stroke:#a5193d}.tau-chart__svg .tau-chart__trendline.color20-3{stroke:#47991a}.tau-chart__svg .tau-chart__trendline.color20-4{stroke:#261c31}.tau-chart__svg .tau-chart__trendline.color20-5{stroke:#9e790c}.tau-chart__svg .tau-chart__trendline.color20-6{stroke:#0c0a08}.tau-chart__svg .tau-chart__trendline.color20-7{stroke:#872f11}.tau-chart__svg .tau-chart__trendline.color20-8{stroke:#888d18}.tau-chart__svg .tau-chart__trendline.color20-9{stroke:#48b8a8}.tau-chart__svg .tau-chart__trendline.color20-10{stroke:#b16fab}.tau-chart__svg .tau-chart__trendline.color20-11{stroke:#9c2ca1}.tau-chart__svg .tau-chart__trendline.color20-12{stroke:#2d3f19}.tau-chart__svg .tau-chart__trendline.color20-13{stroke:#483eaa}.tau-chart__svg .tau-chart__trendline.color20-14{stroke:#5c2028}.tau-chart__svg .tau-chart__trendline.color20-15{stroke:#3b4e4c}.tau-chart__svg .tau-chart__trendline.color20-16{stroke:#b0a353}.tau-chart__svg .tau-chart__trendline.color20-17{stroke:#989b9e}.tau-chart__svg .tau-chart__trendline.color20-18{stroke:#55371d}.tau-chart__svg .tau-chart__trendline.color20-19{stroke:#3eb44b}.tau-chart__svg .tau-chart__trendline.color20-20{stroke:#883063}.tau-chart__svg .tau-chart__trendline.color-default{stroke:#357ac7}.tau-chart__trendlinepanel{box-sizing:border-box;margin-right:20px;padding:20px 0 20px 20px;width:160px}.tau-chart__trendlinepanel__title{font-size:13px;font-weight:600;margin:0 0 10px;text-transform:capitalize}.tau-chart__trendlinepanel__control{width:100%}.tau-chart__trendlinepanel__error-message{font-size:11px;line-height:16px;margin-left:5px}.tau-chart__trendlinepanel.applicable-false .tau-chart__checkbox__icon,.tau-chart__trendlinepanel.applicable-false .tau-chart__checkbox__input,.tau-chart__trendlinepanel.applicable-false .tau-chart__trendlinepanel__control,.tau-chart__trendlinepanel.applicable-false.hide-trendline-error{display:none}.tau-chart__trendline{stroke-dasharray:4 4}.YlGn.q0-3{fill:#f7fcb9;stroke:#f7fcb9;background:#f7fcb9}.YlGn.q1-3{fill:#addd8e;stroke:#addd8e;background:#addd8e}.YlGn.q2-3{fill:#31a354;stroke:#31a354;background:#31a354}.YlGn.q0-4{fill:#ffc;stroke:#ffc;background:#ffc}.YlGn.q1-4{fill:#c2e699;stroke:#c2e699;background:#c2e699}.YlGn.q2-4{fill:#78c679;stroke:#78c679;background:#78c679}.YlGn.q3-4{fill:#238443;stroke:#238443;background:#238443}.YlGn.q0-5{fill:#ffc;stroke:#ffc;background:#ffc}.YlGn.q1-5{fill:#c2e699;stroke:#c2e699;background:#c2e699}.YlGn.q2-5{fill:#78c679;stroke:#78c679;background:#78c679}.YlGn.q3-5{fill:#31a354;stroke:#31a354;background:#31a354}.YlGn.q4-5{fill:#006837;stroke:#006837;background:#006837}.YlGn.q0-6{fill:#ffc;stroke:#ffc;background:#ffc}.YlGn.q1-6{fill:#d9f0a3;stroke:#d9f0a3;background:#d9f0a3}.YlGn.q2-6{fill:#addd8e;stroke:#addd8e;background:#addd8e}.YlGn.q3-6{fill:#78c679;stroke:#78c679;background:#78c679}.YlGn.q4-6{fill:#31a354;stroke:#31a354;background:#31a354}.YlGn.q5-6{fill:#006837;stroke:#006837;background:#006837}.YlGn.q0-7{fill:#ffc;stroke:#ffc;background:#ffc}.YlGn.q1-7{fill:#d9f0a3;stroke:#d9f0a3;background:#d9f0a3}.YlGn.q2-7{fill:#addd8e;stroke:#addd8e;background:#addd8e}.YlGn.q3-7{fill:#78c679;stroke:#78c679;background:#78c679}.YlGn.q4-7{fill:#41ab5d;stroke:#41ab5d;background:#41ab5d}.YlGn.q5-7{fill:#238443;stroke:#238443;background:#238443}.YlGn.q6-7{fill:#005a32;stroke:#005a32;background:#005a32}.YlGn.q0-8{fill:#ffffe5;stroke:#ffffe5;background:#ffffe5}.YlGn.q1-8{fill:#f7fcb9;stroke:#f7fcb9;background:#f7fcb9}.YlGn.q2-8{fill:#d9f0a3;stroke:#d9f0a3;background:#d9f0a3}.YlGn.q3-8{fill:#addd8e;stroke:#addd8e;background:#addd8e}.YlGn.q4-8{fill:#78c679;stroke:#78c679;background:#78c679}.YlGn.q5-8{fill:#41ab5d;stroke:#41ab5d;background:#41ab5d}.YlGn.q6-8{fill:#238443;stroke:#238443;background:#238443}.YlGn.q7-8{fill:#005a32;stroke:#005a32;background:#005a32}.YlGn.q0-9{fill:#ffffe5;stroke:#ffffe5;background:#ffffe5}.YlGn.q1-9{fill:#f7fcb9;stroke:#f7fcb9;background:#f7fcb9}.YlGn.q2-9{fill:#d9f0a3;stroke:#d9f0a3;background:#d9f0a3}.YlGn.q3-9{fill:#addd8e;stroke:#addd8e;background:#addd8e}.YlGn.q4-9{fill:#78c679;stroke:#78c679;background:#78c679}.YlGn.q5-9{fill:#41ab5d;stroke:#41ab5d;background:#41ab5d}.YlGn.q6-9{fill:#238443;stroke:#238443;background:#238443}.YlGn.q7-9{fill:#006837;stroke:#006837;background:#006837}.YlGn.q8-9{fill:#004529;stroke:#004529;background:#004529}.YlGnBu.q0-3{fill:#edf8b1;stroke:#edf8b1;background:#edf8b1}.YlGnBu.q1-3{fill:#7fcdbb;stroke:#7fcdbb;background:#7fcdbb}.YlGnBu.q2-3{fill:#2c7fb8;stroke:#2c7fb8;background:#2c7fb8}.YlGnBu.q0-4{fill:#ffc;stroke:#ffc;background:#ffc}.YlGnBu.q1-4{fill:#a1dab4;stroke:#a1dab4;background:#a1dab4}.YlGnBu.q2-4{fill:#41b6c4;stroke:#41b6c4;background:#41b6c4}.YlGnBu.q3-4{fill:#225ea8;stroke:#225ea8;background:#225ea8}.YlGnBu.q0-5{fill:#ffc;stroke:#ffc;background:#ffc}.YlGnBu.q1-5{fill:#a1dab4;stroke:#a1dab4;background:#a1dab4}.YlGnBu.q2-5{fill:#41b6c4;stroke:#41b6c4;background:#41b6c4}.YlGnBu.q3-5{fill:#2c7fb8;stroke:#2c7fb8;background:#2c7fb8}.YlGnBu.q4-5{fill:#253494;stroke:#253494;background:#253494}.YlGnBu.q0-6{fill:#ffc;stroke:#ffc;background:#ffc}.YlGnBu.q1-6{fill:#c7e9b4;stroke:#c7e9b4;background:#c7e9b4}.YlGnBu.q2-6{fill:#7fcdbb;stroke:#7fcdbb;background:#7fcdbb}.YlGnBu.q3-6{fill:#41b6c4;stroke:#41b6c4;background:#41b6c4}.YlGnBu.q4-6{fill:#2c7fb8;stroke:#2c7fb8;background:#2c7fb8}.YlGnBu.q5-6{fill:#253494;stroke:#253494;background:#253494}.YlGnBu.q0-7{fill:#ffc;stroke:#ffc;background:#ffc}.YlGnBu.q1-7{fill:#c7e9b4;stroke:#c7e9b4;background:#c7e9b4}.YlGnBu.q2-7{fill:#7fcdbb;stroke:#7fcdbb;background:#7fcdbb}.YlGnBu.q3-7{fill:#41b6c4;stroke:#41b6c4;background:#41b6c4}.YlGnBu.q4-7{fill:#1d91c0;stroke:#1d91c0;background:#1d91c0}.YlGnBu.q5-7{fill:#225ea8;stroke:#225ea8;background:#225ea8}.YlGnBu.q6-7{fill:#0c2c84;stroke:#0c2c84;background:#0c2c84}.YlGnBu.q0-8{fill:#ffffd9;stroke:#ffffd9;background:#ffffd9}.YlGnBu.q1-8{fill:#edf8b1;stroke:#edf8b1;background:#edf8b1}.YlGnBu.q2-8{fill:#c7e9b4;stroke:#c7e9b4;background:#c7e9b4}.YlGnBu.q3-8{fill:#7fcdbb;stroke:#7fcdbb;background:#7fcdbb}.YlGnBu.q4-8{fill:#41b6c4;stroke:#41b6c4;background:#41b6c4}.YlGnBu.q5-8{fill:#1d91c0;stroke:#1d91c0;background:#1d91c0}.YlGnBu.q6-8{fill:#225ea8;stroke:#225ea8;background:#225ea8}.YlGnBu.q7-8{fill:#0c2c84;stroke:#0c2c84;background:#0c2c84}.YlGnBu.q0-9{fill:#ffffd9;stroke:#ffffd9;background:#ffffd9}.YlGnBu.q1-9{fill:#edf8b1;stroke:#edf8b1;background:#edf8b1}.YlGnBu.q2-9{fill:#c7e9b4;stroke:#c7e9b4;background:#c7e9b4}.YlGnBu.q3-9{fill:#7fcdbb;stroke:#7fcdbb;background:#7fcdbb}.YlGnBu.q4-9{fill:#41b6c4;stroke:#41b6c4;background:#41b6c4}.YlGnBu.q5-9{fill:#1d91c0;stroke:#1d91c0;background:#1d91c0}.YlGnBu.q6-9{fill:#225ea8;stroke:#225ea8;background:#225ea8}.YlGnBu.q7-9{fill:#253494;stroke:#253494;background:#253494}.YlGnBu.q8-9{fill:#081d58;stroke:#081d58;background:#081d58}.GnBu.q0-3{fill:#e0f3db;stroke:#e0f3db;background:#e0f3db}.GnBu.q1-3{fill:#a8ddb5;stroke:#a8ddb5;background:#a8ddb5}.GnBu.q2-3{fill:#43a2ca;stroke:#43a2ca;background:#43a2ca}.GnBu.q0-4{fill:#f0f9e8;stroke:#f0f9e8;background:#f0f9e8}.GnBu.q1-4{fill:#bae4bc;stroke:#bae4bc;background:#bae4bc}.GnBu.q2-4{fill:#7bccc4;stroke:#7bccc4;background:#7bccc4}.GnBu.q3-4{fill:#2b8cbe;stroke:#2b8cbe;background:#2b8cbe}.GnBu.q0-5{fill:#f0f9e8;stroke:#f0f9e8;background:#f0f9e8}.GnBu.q1-5{fill:#bae4bc;stroke:#bae4bc;background:#bae4bc}.GnBu.q2-5{fill:#7bccc4;stroke:#7bccc4;background:#7bccc4}.GnBu.q3-5{fill:#43a2ca;stroke:#43a2ca;background:#43a2ca}.GnBu.q4-5{fill:#0868ac;stroke:#0868ac;background:#0868ac}.GnBu.q0-6{fill:#f0f9e8;stroke:#f0f9e8;background:#f0f9e8}.GnBu.q1-6{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.GnBu.q2-6{fill:#a8ddb5;stroke:#a8ddb5;background:#a8ddb5}.GnBu.q3-6{fill:#7bccc4;stroke:#7bccc4;background:#7bccc4}.GnBu.q4-6{fill:#43a2ca;stroke:#43a2ca;background:#43a2ca}.GnBu.q5-6{fill:#0868ac;stroke:#0868ac;background:#0868ac}.GnBu.q0-7{fill:#f0f9e8;stroke:#f0f9e8;background:#f0f9e8}.GnBu.q1-7{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.GnBu.q2-7{fill:#a8ddb5;stroke:#a8ddb5;background:#a8ddb5}.GnBu.q3-7{fill:#7bccc4;stroke:#7bccc4;background:#7bccc4}.GnBu.q4-7{fill:#4eb3d3;stroke:#4eb3d3;background:#4eb3d3}.GnBu.q5-7{fill:#2b8cbe;stroke:#2b8cbe;background:#2b8cbe}.GnBu.q6-7{fill:#08589e;stroke:#08589e;background:#08589e}.GnBu.q0-8{fill:#f7fcf0;stroke:#f7fcf0;background:#f7fcf0}.GnBu.q1-8{fill:#e0f3db;stroke:#e0f3db;background:#e0f3db}.GnBu.q2-8{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.GnBu.q3-8{fill:#a8ddb5;stroke:#a8ddb5;background:#a8ddb5}.GnBu.q4-8{fill:#7bccc4;stroke:#7bccc4;background:#7bccc4}.GnBu.q5-8{fill:#4eb3d3;stroke:#4eb3d3;background:#4eb3d3}.GnBu.q6-8{fill:#2b8cbe;stroke:#2b8cbe;background:#2b8cbe}.GnBu.q7-8{fill:#08589e;stroke:#08589e;background:#08589e}.GnBu.q0-9{fill:#f7fcf0;stroke:#f7fcf0;background:#f7fcf0}.GnBu.q1-9{fill:#e0f3db;stroke:#e0f3db;background:#e0f3db}.GnBu.q2-9{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.GnBu.q3-9{fill:#a8ddb5;stroke:#a8ddb5;background:#a8ddb5}.GnBu.q4-9{fill:#7bccc4;stroke:#7bccc4;background:#7bccc4}.GnBu.q5-9{fill:#4eb3d3;stroke:#4eb3d3;background:#4eb3d3}.GnBu.q6-9{fill:#2b8cbe;stroke:#2b8cbe;background:#2b8cbe}.GnBu.q7-9{fill:#0868ac;stroke:#0868ac;background:#0868ac}.GnBu.q8-9{fill:#084081;stroke:#084081;background:#084081}.BuGn.q0-3{fill:#e5f5f9;stroke:#e5f5f9;background:#e5f5f9}.BuGn.q1-3{fill:#99d8c9;stroke:#99d8c9;background:#99d8c9}.BuGn.q2-3{fill:#2ca25f;stroke:#2ca25f;background:#2ca25f}.BuGn.q0-4{fill:#edf8fb;stroke:#edf8fb;background:#edf8fb}.BuGn.q1-4{fill:#b2e2e2;stroke:#b2e2e2;background:#b2e2e2}.BuGn.q2-4{fill:#66c2a4;stroke:#66c2a4;background:#66c2a4}.BuGn.q3-4{fill:#238b45;stroke:#238b45;background:#238b45}.BuGn.q0-5{fill:#edf8fb;stroke:#edf8fb;background:#edf8fb}.BuGn.q1-5{fill:#b2e2e2;stroke:#b2e2e2;background:#b2e2e2}.BuGn.q2-5{fill:#66c2a4;stroke:#66c2a4;background:#66c2a4}.BuGn.q3-5{fill:#2ca25f;stroke:#2ca25f;background:#2ca25f}.BuGn.q4-5{fill:#006d2c;stroke:#006d2c;background:#006d2c}.BuGn.q0-6{fill:#edf8fb;stroke:#edf8fb;background:#edf8fb}.BuGn.q1-6{fill:#ccece6;stroke:#ccece6;background:#ccece6}.BuGn.q2-6{fill:#99d8c9;stroke:#99d8c9;background:#99d8c9}.BuGn.q3-6{fill:#66c2a4;stroke:#66c2a4;background:#66c2a4}.BuGn.q4-6{fill:#2ca25f;stroke:#2ca25f;background:#2ca25f}.BuGn.q5-6{fill:#006d2c;stroke:#006d2c;background:#006d2c}.BuGn.q0-7{fill:#edf8fb;stroke:#edf8fb;background:#edf8fb}.BuGn.q1-7{fill:#ccece6;stroke:#ccece6;background:#ccece6}.BuGn.q2-7{fill:#99d8c9;stroke:#99d8c9;background:#99d8c9}.BuGn.q3-7{fill:#66c2a4;stroke:#66c2a4;background:#66c2a4}.BuGn.q4-7{fill:#41ae76;stroke:#41ae76;background:#41ae76}.BuGn.q5-7{fill:#238b45;stroke:#238b45;background:#238b45}.BuGn.q6-7{fill:#005824;stroke:#005824;background:#005824}.BuGn.q0-8{fill:#f7fcfd;stroke:#f7fcfd;background:#f7fcfd}.BuGn.q1-8{fill:#e5f5f9;stroke:#e5f5f9;background:#e5f5f9}.BuGn.q2-8{fill:#ccece6;stroke:#ccece6;background:#ccece6}.BuGn.q3-8{fill:#99d8c9;stroke:#99d8c9;background:#99d8c9}.BuGn.q4-8{fill:#66c2a4;stroke:#66c2a4;background:#66c2a4}.BuGn.q5-8{fill:#41ae76;stroke:#41ae76;background:#41ae76}.BuGn.q6-8{fill:#238b45;stroke:#238b45;background:#238b45}.BuGn.q7-8{fill:#005824;stroke:#005824;background:#005824}.BuGn.q0-9{fill:#f7fcfd;stroke:#f7fcfd;background:#f7fcfd}.BuGn.q1-9{fill:#e5f5f9;stroke:#e5f5f9;background:#e5f5f9}.BuGn.q2-9{fill:#ccece6;stroke:#ccece6;background:#ccece6}.BuGn.q3-9{fill:#99d8c9;stroke:#99d8c9;background:#99d8c9}.BuGn.q4-9{fill:#66c2a4;stroke:#66c2a4;background:#66c2a4}.BuGn.q5-9{fill:#41ae76;stroke:#41ae76;background:#41ae76}.BuGn.q6-9{fill:#238b45;stroke:#238b45;background:#238b45}.BuGn.q7-9{fill:#006d2c;stroke:#006d2c;background:#006d2c}.BuGn.q8-9{fill:#00441b;stroke:#00441b;background:#00441b}.PuBuGn.q0-3{fill:#ece2f0;stroke:#ece2f0;background:#ece2f0}.PuBuGn.q1-3{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBuGn.q2-3{fill:#1c9099;stroke:#1c9099;background:#1c9099}.PuBuGn.q0-4{fill:#f6eff7;stroke:#f6eff7;background:#f6eff7}.PuBuGn.q1-4{fill:#bdc9e1;stroke:#bdc9e1;background:#bdc9e1}.PuBuGn.q2-4{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.PuBuGn.q3-4{fill:#02818a;stroke:#02818a;background:#02818a}.PuBuGn.q0-5{fill:#f6eff7;stroke:#f6eff7;background:#f6eff7}.PuBuGn.q1-5{fill:#bdc9e1;stroke:#bdc9e1;background:#bdc9e1}.PuBuGn.q2-5{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.PuBuGn.q3-5{fill:#1c9099;stroke:#1c9099;background:#1c9099}.PuBuGn.q4-5{fill:#016c59;stroke:#016c59;background:#016c59}.PuBuGn.q0-6{fill:#f6eff7;stroke:#f6eff7;background:#f6eff7}.PuBuGn.q1-6{fill:#d0d1e6;stroke:#d0d1e6;background:#d0d1e6}.PuBuGn.q2-6{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBuGn.q3-6{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.PuBuGn.q4-6{fill:#1c9099;stroke:#1c9099;background:#1c9099}.PuBuGn.q5-6{fill:#016c59;stroke:#016c59;background:#016c59}.PuBuGn.q0-7{fill:#f6eff7;stroke:#f6eff7;background:#f6eff7}.PuBuGn.q1-7{fill:#d0d1e6;stroke:#d0d1e6;background:#d0d1e6}.PuBuGn.q2-7{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBuGn.q3-7{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.PuBuGn.q4-7{fill:#3690c0;stroke:#3690c0;background:#3690c0}.PuBuGn.q5-7{fill:#02818a;stroke:#02818a;background:#02818a}.PuBuGn.q6-7{fill:#016450;stroke:#016450;background:#016450}.PuBuGn.q0-8{fill:#fff7fb;stroke:#fff7fb;background:#fff7fb}.PuBuGn.q1-8{fill:#ece2f0;stroke:#ece2f0;background:#ece2f0}.PuBuGn.q2-8{fill:#d0d1e6;stroke:#d0d1e6;background:#d0d1e6}.PuBuGn.q3-8{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBuGn.q4-8{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.PuBuGn.q5-8{fill:#3690c0;stroke:#3690c0;background:#3690c0}.PuBuGn.q6-8{fill:#02818a;stroke:#02818a;background:#02818a}.PuBuGn.q7-8{fill:#016450;stroke:#016450;background:#016450}.PuBuGn.q0-9{fill:#fff7fb;stroke:#fff7fb;background:#fff7fb}.PuBuGn.q1-9{fill:#ece2f0;stroke:#ece2f0;background:#ece2f0}.PuBuGn.q2-9{fill:#d0d1e6;stroke:#d0d1e6;background:#d0d1e6}.PuBuGn.q3-9{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBuGn.q4-9{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.PuBuGn.q5-9{fill:#3690c0;stroke:#3690c0;background:#3690c0}.PuBuGn.q6-9{fill:#02818a;stroke:#02818a;background:#02818a}.PuBuGn.q7-9{fill:#016c59;stroke:#016c59;background:#016c59}.PuBuGn.q8-9{fill:#014636;stroke:#014636;background:#014636}.PuBu.q0-3{fill:#ece7f2;stroke:#ece7f2;background:#ece7f2}.PuBu.q1-3{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBu.q2-3{fill:#2b8cbe;stroke:#2b8cbe;background:#2b8cbe}.PuBu.q0-4{fill:#f1eef6;stroke:#f1eef6;background:#f1eef6}.PuBu.q1-4{fill:#bdc9e1;stroke:#bdc9e1;background:#bdc9e1}.PuBu.q2-4{fill:#74a9cf;stroke:#74a9cf;background:#74a9cf}.PuBu.q3-4{fill:#0570b0;stroke:#0570b0;background:#0570b0}.PuBu.q0-5{fill:#f1eef6;stroke:#f1eef6;background:#f1eef6}.PuBu.q1-5{fill:#bdc9e1;stroke:#bdc9e1;background:#bdc9e1}.PuBu.q2-5{fill:#74a9cf;stroke:#74a9cf;background:#74a9cf}.PuBu.q3-5{fill:#2b8cbe;stroke:#2b8cbe;background:#2b8cbe}.PuBu.q4-5{fill:#045a8d;stroke:#045a8d;background:#045a8d}.PuBu.q0-6{fill:#f1eef6;stroke:#f1eef6;background:#f1eef6}.PuBu.q1-6{fill:#d0d1e6;stroke:#d0d1e6;background:#d0d1e6}.PuBu.q2-6{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBu.q3-6{fill:#74a9cf;stroke:#74a9cf;background:#74a9cf}.PuBu.q4-6{fill:#2b8cbe;stroke:#2b8cbe;background:#2b8cbe}.PuBu.q5-6{fill:#045a8d;stroke:#045a8d;background:#045a8d}.PuBu.q0-7{fill:#f1eef6;stroke:#f1eef6;background:#f1eef6}.PuBu.q1-7{fill:#d0d1e6;stroke:#d0d1e6;background:#d0d1e6}.PuBu.q2-7{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBu.q3-7{fill:#74a9cf;stroke:#74a9cf;background:#74a9cf}.PuBu.q4-7{fill:#3690c0;stroke:#3690c0;background:#3690c0}.PuBu.q5-7{fill:#0570b0;stroke:#0570b0;background:#0570b0}.PuBu.q6-7{fill:#034e7b;stroke:#034e7b;background:#034e7b}.PuBu.q0-8{fill:#fff7fb;stroke:#fff7fb;background:#fff7fb}.PuBu.q1-8{fill:#ece7f2;stroke:#ece7f2;background:#ece7f2}.PuBu.q2-8{fill:#d0d1e6;stroke:#d0d1e6;background:#d0d1e6}.PuBu.q3-8{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBu.q4-8{fill:#74a9cf;stroke:#74a9cf;background:#74a9cf}.PuBu.q5-8{fill:#3690c0;stroke:#3690c0;background:#3690c0}.PuBu.q6-8{fill:#0570b0;stroke:#0570b0;background:#0570b0}.PuBu.q7-8{fill:#034e7b;stroke:#034e7b;background:#034e7b}.PuBu.q0-9{fill:#fff7fb;stroke:#fff7fb;background:#fff7fb}.PuBu.q1-9{fill:#ece7f2;stroke:#ece7f2;background:#ece7f2}.PuBu.q2-9{fill:#d0d1e6;stroke:#d0d1e6;background:#d0d1e6}.PuBu.q3-9{fill:#a6bddb;stroke:#a6bddb;background:#a6bddb}.PuBu.q4-9{fill:#74a9cf;stroke:#74a9cf;background:#74a9cf}.PuBu.q5-9{fill:#3690c0;stroke:#3690c0;background:#3690c0}.PuBu.q6-9{fill:#0570b0;stroke:#0570b0;background:#0570b0}.PuBu.q7-9{fill:#045a8d;stroke:#045a8d;background:#045a8d}.PuBu.q8-9{fill:#023858;stroke:#023858;background:#023858}.BuPu.q0-3{fill:#e0ecf4;stroke:#e0ecf4;background:#e0ecf4}.BuPu.q1-3{fill:#9ebcda;stroke:#9ebcda;background:#9ebcda}.BuPu.q2-3{fill:#8856a7;stroke:#8856a7;background:#8856a7}.BuPu.q0-4{fill:#edf8fb;stroke:#edf8fb;background:#edf8fb}.BuPu.q1-4{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.BuPu.q2-4{fill:#8c96c6;stroke:#8c96c6;background:#8c96c6}.BuPu.q3-4{fill:#88419d;stroke:#88419d;background:#88419d}.BuPu.q0-5{fill:#edf8fb;stroke:#edf8fb;background:#edf8fb}.BuPu.q1-5{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.BuPu.q2-5{fill:#8c96c6;stroke:#8c96c6;background:#8c96c6}.BuPu.q3-5{fill:#8856a7;stroke:#8856a7;background:#8856a7}.BuPu.q4-5{fill:#810f7c;stroke:#810f7c;background:#810f7c}.BuPu.q0-6{fill:#edf8fb;stroke:#edf8fb;background:#edf8fb}.BuPu.q1-6{fill:#bfd3e6;stroke:#bfd3e6;background:#bfd3e6}.BuPu.q2-6{fill:#9ebcda;stroke:#9ebcda;background:#9ebcda}.BuPu.q3-6{fill:#8c96c6;stroke:#8c96c6;background:#8c96c6}.BuPu.q4-6{fill:#8856a7;stroke:#8856a7;background:#8856a7}.BuPu.q5-6{fill:#810f7c;stroke:#810f7c;background:#810f7c}.BuPu.q0-7{fill:#edf8fb;stroke:#edf8fb;background:#edf8fb}.BuPu.q1-7{fill:#bfd3e6;stroke:#bfd3e6;background:#bfd3e6}.BuPu.q2-7{fill:#9ebcda;stroke:#9ebcda;background:#9ebcda}.BuPu.q3-7{fill:#8c96c6;stroke:#8c96c6;background:#8c96c6}.BuPu.q4-7{fill:#8c6bb1;stroke:#8c6bb1;background:#8c6bb1}.BuPu.q5-7{fill:#88419d;stroke:#88419d;background:#88419d}.BuPu.q6-7{fill:#6e016b;stroke:#6e016b;background:#6e016b}.BuPu.q0-8{fill:#f7fcfd;stroke:#f7fcfd;background:#f7fcfd}.BuPu.q1-8{fill:#e0ecf4;stroke:#e0ecf4;background:#e0ecf4}.BuPu.q2-8{fill:#bfd3e6;stroke:#bfd3e6;background:#bfd3e6}.BuPu.q3-8{fill:#9ebcda;stroke:#9ebcda;background:#9ebcda}.BuPu.q4-8{fill:#8c96c6;stroke:#8c96c6;background:#8c96c6}.BuPu.q5-8{fill:#8c6bb1;stroke:#8c6bb1;background:#8c6bb1}.BuPu.q6-8{fill:#88419d;stroke:#88419d;background:#88419d}.BuPu.q7-8{fill:#6e016b;stroke:#6e016b;background:#6e016b}.BuPu.q0-9{fill:#f7fcfd;stroke:#f7fcfd;background:#f7fcfd}.BuPu.q1-9{fill:#e0ecf4;stroke:#e0ecf4;background:#e0ecf4}.BuPu.q2-9{fill:#bfd3e6;stroke:#bfd3e6;background:#bfd3e6}.BuPu.q3-9{fill:#9ebcda;stroke:#9ebcda;background:#9ebcda}.BuPu.q4-9{fill:#8c96c6;stroke:#8c96c6;background:#8c96c6}.BuPu.q5-9{fill:#8c6bb1;stroke:#8c6bb1;background:#8c6bb1}.BuPu.q6-9{fill:#88419d;stroke:#88419d;background:#88419d}.BuPu.q7-9{fill:#810f7c;stroke:#810f7c;background:#810f7c}.BuPu.q8-9{fill:#4d004b;stroke:#4d004b;background:#4d004b}.RdPu.q0-3{fill:#fde0dd;stroke:#fde0dd;background:#fde0dd}.RdPu.q1-3{fill:#fa9fb5;stroke:#fa9fb5;background:#fa9fb5}.RdPu.q2-3{fill:#c51b8a;stroke:#c51b8a;background:#c51b8a}.RdPu.q0-4{fill:#feebe2;stroke:#feebe2;background:#feebe2}.RdPu.q1-4{fill:#fbb4b9;stroke:#fbb4b9;background:#fbb4b9}.RdPu.q2-4{fill:#f768a1;stroke:#f768a1;background:#f768a1}.RdPu.q3-4{fill:#ae017e;stroke:#ae017e;background:#ae017e}.RdPu.q0-5{fill:#feebe2;stroke:#feebe2;background:#feebe2}.RdPu.q1-5{fill:#fbb4b9;stroke:#fbb4b9;background:#fbb4b9}.RdPu.q2-5{fill:#f768a1;stroke:#f768a1;background:#f768a1}.RdPu.q3-5{fill:#c51b8a;stroke:#c51b8a;background:#c51b8a}.RdPu.q4-5{fill:#7a0177;stroke:#7a0177;background:#7a0177}.RdPu.q0-6{fill:#feebe2;stroke:#feebe2;background:#feebe2}.RdPu.q1-6{fill:#fcc5c0;stroke:#fcc5c0;background:#fcc5c0}.RdPu.q2-6{fill:#fa9fb5;stroke:#fa9fb5;background:#fa9fb5}.RdPu.q3-6{fill:#f768a1;stroke:#f768a1;background:#f768a1}.RdPu.q4-6{fill:#c51b8a;stroke:#c51b8a;background:#c51b8a}.RdPu.q5-6{fill:#7a0177;stroke:#7a0177;background:#7a0177}.RdPu.q0-7{fill:#feebe2;stroke:#feebe2;background:#feebe2}.RdPu.q1-7{fill:#fcc5c0;stroke:#fcc5c0;background:#fcc5c0}.RdPu.q2-7{fill:#fa9fb5;stroke:#fa9fb5;background:#fa9fb5}.RdPu.q3-7{fill:#f768a1;stroke:#f768a1;background:#f768a1}.RdPu.q4-7{fill:#dd3497;stroke:#dd3497;background:#dd3497}.RdPu.q5-7{fill:#ae017e;stroke:#ae017e;background:#ae017e}.RdPu.q6-7{fill:#7a0177;stroke:#7a0177;background:#7a0177}.RdPu.q0-8{fill:#fff7f3;stroke:#fff7f3;background:#fff7f3}.RdPu.q1-8{fill:#fde0dd;stroke:#fde0dd;background:#fde0dd}.RdPu.q2-8{fill:#fcc5c0;stroke:#fcc5c0;background:#fcc5c0}.RdPu.q3-8{fill:#fa9fb5;stroke:#fa9fb5;background:#fa9fb5}.RdPu.q4-8{fill:#f768a1;stroke:#f768a1;background:#f768a1}.RdPu.q5-8{fill:#dd3497;stroke:#dd3497;background:#dd3497}.RdPu.q6-8{fill:#ae017e;stroke:#ae017e;background:#ae017e}.RdPu.q7-8{fill:#7a0177;stroke:#7a0177;background:#7a0177}.RdPu.q0-9{fill:#fff7f3;stroke:#fff7f3;background:#fff7f3}.RdPu.q1-9{fill:#fde0dd;stroke:#fde0dd;background:#fde0dd}.RdPu.q2-9{fill:#fcc5c0;stroke:#fcc5c0;background:#fcc5c0}.RdPu.q3-9{fill:#fa9fb5;stroke:#fa9fb5;background:#fa9fb5}.RdPu.q4-9{fill:#f768a1;stroke:#f768a1;background:#f768a1}.RdPu.q5-9{fill:#dd3497;stroke:#dd3497;background:#dd3497}.RdPu.q6-9{fill:#ae017e;stroke:#ae017e;background:#ae017e}.RdPu.q7-9{fill:#7a0177;stroke:#7a0177;background:#7a0177}.RdPu.q8-9{fill:#49006a;stroke:#49006a;background:#49006a}.PuRd.q0-3{fill:#e7e1ef;stroke:#e7e1ef;background:#e7e1ef}.PuRd.q1-3{fill:#c994c7;stroke:#c994c7;background:#c994c7}.PuRd.q2-3{fill:#dd1c77;stroke:#dd1c77;background:#dd1c77}.PuRd.q0-4{fill:#f1eef6;stroke:#f1eef6;background:#f1eef6}.PuRd.q1-4{fill:#d7b5d8;stroke:#d7b5d8;background:#d7b5d8}.PuRd.q2-4{fill:#df65b0;stroke:#df65b0;background:#df65b0}.PuRd.q3-4{fill:#ce1256;stroke:#ce1256;background:#ce1256}.PuRd.q0-5{fill:#f1eef6;stroke:#f1eef6;background:#f1eef6}.PuRd.q1-5{fill:#d7b5d8;stroke:#d7b5d8;background:#d7b5d8}.PuRd.q2-5{fill:#df65b0;stroke:#df65b0;background:#df65b0}.PuRd.q3-5{fill:#dd1c77;stroke:#dd1c77;background:#dd1c77}.PuRd.q4-5{fill:#980043;stroke:#980043;background:#980043}.PuRd.q0-6{fill:#f1eef6;stroke:#f1eef6;background:#f1eef6}.PuRd.q1-6{fill:#d4b9da;stroke:#d4b9da;background:#d4b9da}.PuRd.q2-6{fill:#c994c7;stroke:#c994c7;background:#c994c7}.PuRd.q3-6{fill:#df65b0;stroke:#df65b0;background:#df65b0}.PuRd.q4-6{fill:#dd1c77;stroke:#dd1c77;background:#dd1c77}.PuRd.q5-6{fill:#980043;stroke:#980043;background:#980043}.PuRd.q0-7{fill:#f1eef6;stroke:#f1eef6;background:#f1eef6}.PuRd.q1-7{fill:#d4b9da;stroke:#d4b9da;background:#d4b9da}.PuRd.q2-7{fill:#c994c7;stroke:#c994c7;background:#c994c7}.PuRd.q3-7{fill:#df65b0;stroke:#df65b0;background:#df65b0}.PuRd.q4-7{fill:#e7298a;stroke:#e7298a;background:#e7298a}.PuRd.q5-7{fill:#ce1256;stroke:#ce1256;background:#ce1256}.PuRd.q6-7{fill:#91003f;stroke:#91003f;background:#91003f}.PuRd.q0-8{fill:#f7f4f9;stroke:#f7f4f9;background:#f7f4f9}.PuRd.q1-8{fill:#e7e1ef;stroke:#e7e1ef;background:#e7e1ef}.PuRd.q2-8{fill:#d4b9da;stroke:#d4b9da;background:#d4b9da}.PuRd.q3-8{fill:#c994c7;stroke:#c994c7;background:#c994c7}.PuRd.q4-8{fill:#df65b0;stroke:#df65b0;background:#df65b0}.PuRd.q5-8{fill:#e7298a;stroke:#e7298a;background:#e7298a}.PuRd.q6-8{fill:#ce1256;stroke:#ce1256;background:#ce1256}.PuRd.q7-8{fill:#91003f;stroke:#91003f;background:#91003f}.PuRd.q0-9{fill:#f7f4f9;stroke:#f7f4f9;background:#f7f4f9}.PuRd.q1-9{fill:#e7e1ef;stroke:#e7e1ef;background:#e7e1ef}.PuRd.q2-9{fill:#d4b9da;stroke:#d4b9da;background:#d4b9da}.PuRd.q3-9{fill:#c994c7;stroke:#c994c7;background:#c994c7}.PuRd.q4-9{fill:#df65b0;stroke:#df65b0;background:#df65b0}.PuRd.q5-9{fill:#e7298a;stroke:#e7298a;background:#e7298a}.PuRd.q6-9{fill:#ce1256;stroke:#ce1256;background:#ce1256}.PuRd.q7-9{fill:#980043;stroke:#980043;background:#980043}.PuRd.q8-9{fill:#67001f;stroke:#67001f;background:#67001f}.OrRd.q0-3{fill:#fee8c8;stroke:#fee8c8;background:#fee8c8}.OrRd.q1-3{fill:#fdbb84;stroke:#fdbb84;background:#fdbb84}.OrRd.q2-3{fill:#e34a33;stroke:#e34a33;background:#e34a33}.OrRd.q0-4{fill:#fef0d9;stroke:#fef0d9;background:#fef0d9}.OrRd.q1-4{fill:#fdcc8a;stroke:#fdcc8a;background:#fdcc8a}.OrRd.q2-4{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.OrRd.q3-4{fill:#d7301f;stroke:#d7301f;background:#d7301f}.OrRd.q0-5{fill:#fef0d9;stroke:#fef0d9;background:#fef0d9}.OrRd.q1-5{fill:#fdcc8a;stroke:#fdcc8a;background:#fdcc8a}.OrRd.q2-5{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.OrRd.q3-5{fill:#e34a33;stroke:#e34a33;background:#e34a33}.OrRd.q4-5{fill:#b30000;stroke:#b30000;background:#b30000}.OrRd.q0-6{fill:#fef0d9;stroke:#fef0d9;background:#fef0d9}.OrRd.q1-6{fill:#fdd49e;stroke:#fdd49e;background:#fdd49e}.OrRd.q2-6{fill:#fdbb84;stroke:#fdbb84;background:#fdbb84}.OrRd.q3-6{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.OrRd.q4-6{fill:#e34a33;stroke:#e34a33;background:#e34a33}.OrRd.q5-6{fill:#b30000;stroke:#b30000;background:#b30000}.OrRd.q0-7{fill:#fef0d9;stroke:#fef0d9;background:#fef0d9}.OrRd.q1-7{fill:#fdd49e;stroke:#fdd49e;background:#fdd49e}.OrRd.q2-7{fill:#fdbb84;stroke:#fdbb84;background:#fdbb84}.OrRd.q3-7{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.OrRd.q4-7{fill:#ef6548;stroke:#ef6548;background:#ef6548}.OrRd.q5-7{fill:#d7301f;stroke:#d7301f;background:#d7301f}.OrRd.q6-7{fill:#900;stroke:#900;background:#900}.OrRd.q0-8{fill:#fff7ec;stroke:#fff7ec;background:#fff7ec}.OrRd.q1-8{fill:#fee8c8;stroke:#fee8c8;background:#fee8c8}.OrRd.q2-8{fill:#fdd49e;stroke:#fdd49e;background:#fdd49e}.OrRd.q3-8{fill:#fdbb84;stroke:#fdbb84;background:#fdbb84}.OrRd.q4-8{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.OrRd.q5-8{fill:#ef6548;stroke:#ef6548;background:#ef6548}.OrRd.q6-8{fill:#d7301f;stroke:#d7301f;background:#d7301f}.OrRd.q7-8{fill:#900;stroke:#900;background:#900}.OrRd.q0-9{fill:#fff7ec;stroke:#fff7ec;background:#fff7ec}.OrRd.q1-9{fill:#fee8c8;stroke:#fee8c8;background:#fee8c8}.OrRd.q2-9{fill:#fdd49e;stroke:#fdd49e;background:#fdd49e}.OrRd.q3-9{fill:#fdbb84;stroke:#fdbb84;background:#fdbb84}.OrRd.q4-9{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.OrRd.q5-9{fill:#ef6548;stroke:#ef6548;background:#ef6548}.OrRd.q6-9{fill:#d7301f;stroke:#d7301f;background:#d7301f}.OrRd.q7-9{fill:#b30000;stroke:#b30000;background:#b30000}.OrRd.q8-9{fill:#7f0000;stroke:#7f0000;background:#7f0000}.YlOrRd.q0-3{fill:#ffeda0;stroke:#ffeda0;background:#ffeda0}.YlOrRd.q1-3{fill:#feb24c;stroke:#feb24c;background:#feb24c}.YlOrRd.q2-3{fill:#f03b20;stroke:#f03b20;background:#f03b20}.YlOrRd.q0-4{fill:#ffffb2;stroke:#ffffb2;background:#ffffb2}.YlOrRd.q1-4{fill:#fecc5c;stroke:#fecc5c;background:#fecc5c}.YlOrRd.q2-4{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.YlOrRd.q3-4{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.YlOrRd.q0-5{fill:#ffffb2;stroke:#ffffb2;background:#ffffb2}.YlOrRd.q1-5{fill:#fecc5c;stroke:#fecc5c;background:#fecc5c}.YlOrRd.q2-5{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.YlOrRd.q3-5{fill:#f03b20;stroke:#f03b20;background:#f03b20}.YlOrRd.q4-5{fill:#bd0026;stroke:#bd0026;background:#bd0026}.YlOrRd.q0-6{fill:#ffffb2;stroke:#ffffb2;background:#ffffb2}.YlOrRd.q1-6{fill:#fed976;stroke:#fed976;background:#fed976}.YlOrRd.q2-6{fill:#feb24c;stroke:#feb24c;background:#feb24c}.YlOrRd.q3-6{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.YlOrRd.q4-6{fill:#f03b20;stroke:#f03b20;background:#f03b20}.YlOrRd.q5-6{fill:#bd0026;stroke:#bd0026;background:#bd0026}.YlOrRd.q0-7{fill:#ffffb2;stroke:#ffffb2;background:#ffffb2}.YlOrRd.q1-7{fill:#fed976;stroke:#fed976;background:#fed976}.YlOrRd.q2-7{fill:#feb24c;stroke:#feb24c;background:#feb24c}.YlOrRd.q3-7{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.YlOrRd.q4-7{fill:#fc4e2a;stroke:#fc4e2a;background:#fc4e2a}.YlOrRd.q5-7{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.YlOrRd.q6-7{fill:#b10026;stroke:#b10026;background:#b10026}.YlOrRd.q0-8{fill:#ffc;stroke:#ffc;background:#ffc}.YlOrRd.q1-8{fill:#ffeda0;stroke:#ffeda0;background:#ffeda0}.YlOrRd.q2-8{fill:#fed976;stroke:#fed976;background:#fed976}.YlOrRd.q3-8{fill:#feb24c;stroke:#feb24c;background:#feb24c}.YlOrRd.q4-8{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.YlOrRd.q5-8{fill:#fc4e2a;stroke:#fc4e2a;background:#fc4e2a}.YlOrRd.q6-8{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.YlOrRd.q7-8{fill:#b10026;stroke:#b10026;background:#b10026}.YlOrRd.q0-9{fill:#ffc;stroke:#ffc;background:#ffc}.YlOrRd.q1-9{fill:#ffeda0;stroke:#ffeda0;background:#ffeda0}.YlOrRd.q2-9{fill:#fed976;stroke:#fed976;background:#fed976}.YlOrRd.q3-9{fill:#feb24c;stroke:#feb24c;background:#feb24c}.YlOrRd.q4-9{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.YlOrRd.q5-9{fill:#fc4e2a;stroke:#fc4e2a;background:#fc4e2a}.YlOrRd.q6-9{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.YlOrRd.q7-9{fill:#bd0026;stroke:#bd0026;background:#bd0026}.YlOrRd.q8-9{fill:#800026;stroke:#800026;background:#800026}.YlOrBr.q0-3{fill:#fff7bc;stroke:#fff7bc;background:#fff7bc}.YlOrBr.q1-3{fill:#fec44f;stroke:#fec44f;background:#fec44f}.YlOrBr.q2-3{fill:#d95f0e;stroke:#d95f0e;background:#d95f0e}.YlOrBr.q0-4{fill:#ffffd4;stroke:#ffffd4;background:#ffffd4}.YlOrBr.q1-4{fill:#fed98e;stroke:#fed98e;background:#fed98e}.YlOrBr.q2-4{fill:#fe9929;stroke:#fe9929;background:#fe9929}.YlOrBr.q3-4{fill:#cc4c02;stroke:#cc4c02;background:#cc4c02}.YlOrBr.q0-5{fill:#ffffd4;stroke:#ffffd4;background:#ffffd4}.YlOrBr.q1-5{fill:#fed98e;stroke:#fed98e;background:#fed98e}.YlOrBr.q2-5{fill:#fe9929;stroke:#fe9929;background:#fe9929}.YlOrBr.q3-5{fill:#d95f0e;stroke:#d95f0e;background:#d95f0e}.YlOrBr.q4-5{fill:#993404;stroke:#993404;background:#993404}.YlOrBr.q0-6{fill:#ffffd4;stroke:#ffffd4;background:#ffffd4}.YlOrBr.q1-6{fill:#fee391;stroke:#fee391;background:#fee391}.YlOrBr.q2-6{fill:#fec44f;stroke:#fec44f;background:#fec44f}.YlOrBr.q3-6{fill:#fe9929;stroke:#fe9929;background:#fe9929}.YlOrBr.q4-6{fill:#d95f0e;stroke:#d95f0e;background:#d95f0e}.YlOrBr.q5-6{fill:#993404;stroke:#993404;background:#993404}.YlOrBr.q0-7{fill:#ffffd4;stroke:#ffffd4;background:#ffffd4}.YlOrBr.q1-7{fill:#fee391;stroke:#fee391;background:#fee391}.YlOrBr.q2-7{fill:#fec44f;stroke:#fec44f;background:#fec44f}.YlOrBr.q3-7{fill:#fe9929;stroke:#fe9929;background:#fe9929}.YlOrBr.q4-7{fill:#ec7014;stroke:#ec7014;background:#ec7014}.YlOrBr.q5-7{fill:#cc4c02;stroke:#cc4c02;background:#cc4c02}.YlOrBr.q6-7{fill:#8c2d04;stroke:#8c2d04;background:#8c2d04}.YlOrBr.q0-8{fill:#ffffe5;stroke:#ffffe5;background:#ffffe5}.YlOrBr.q1-8{fill:#fff7bc;stroke:#fff7bc;background:#fff7bc}.YlOrBr.q2-8{fill:#fee391;stroke:#fee391;background:#fee391}.YlOrBr.q3-8{fill:#fec44f;stroke:#fec44f;background:#fec44f}.YlOrBr.q4-8{fill:#fe9929;stroke:#fe9929;background:#fe9929}.YlOrBr.q5-8{fill:#ec7014;stroke:#ec7014;background:#ec7014}.YlOrBr.q6-8{fill:#cc4c02;stroke:#cc4c02;background:#cc4c02}.YlOrBr.q7-8{fill:#8c2d04;stroke:#8c2d04;background:#8c2d04}.YlOrBr.q0-9{fill:#ffffe5;stroke:#ffffe5;background:#ffffe5}.YlOrBr.q1-9{fill:#fff7bc;stroke:#fff7bc;background:#fff7bc}.YlOrBr.q2-9{fill:#fee391;stroke:#fee391;background:#fee391}.YlOrBr.q3-9{fill:#fec44f;stroke:#fec44f;background:#fec44f}.YlOrBr.q4-9{fill:#fe9929;stroke:#fe9929;background:#fe9929}.YlOrBr.q5-9{fill:#ec7014;stroke:#ec7014;background:#ec7014}.YlOrBr.q6-9{fill:#cc4c02;stroke:#cc4c02;background:#cc4c02}.YlOrBr.q7-9{fill:#993404;stroke:#993404;background:#993404}.YlOrBr.q8-9{fill:#662506;stroke:#662506;background:#662506}.Purples.q0-3{fill:#efedf5;stroke:#efedf5;background:#efedf5}.Purples.q1-3{fill:#bcbddc;stroke:#bcbddc;background:#bcbddc}.Purples.q2-3{fill:#756bb1;stroke:#756bb1;background:#756bb1}.Purples.q0-4{fill:#f2f0f7;stroke:#f2f0f7;background:#f2f0f7}.Purples.q1-4{fill:#cbc9e2;stroke:#cbc9e2;background:#cbc9e2}.Purples.q2-4{fill:#9e9ac8;stroke:#9e9ac8;background:#9e9ac8}.Purples.q3-4{fill:#6a51a3;stroke:#6a51a3;background:#6a51a3}.Purples.q0-5{fill:#f2f0f7;stroke:#f2f0f7;background:#f2f0f7}.Purples.q1-5{fill:#cbc9e2;stroke:#cbc9e2;background:#cbc9e2}.Purples.q2-5{fill:#9e9ac8;stroke:#9e9ac8;background:#9e9ac8}.Purples.q3-5{fill:#756bb1;stroke:#756bb1;background:#756bb1}.Purples.q4-5{fill:#54278f;stroke:#54278f;background:#54278f}.Purples.q0-6{fill:#f2f0f7;stroke:#f2f0f7;background:#f2f0f7}.Purples.q1-6{fill:#dadaeb;stroke:#dadaeb;background:#dadaeb}.Purples.q2-6{fill:#bcbddc;stroke:#bcbddc;background:#bcbddc}.Purples.q3-6{fill:#9e9ac8;stroke:#9e9ac8;background:#9e9ac8}.Purples.q4-6{fill:#756bb1;stroke:#756bb1;background:#756bb1}.Purples.q5-6{fill:#54278f;stroke:#54278f;background:#54278f}.Purples.q0-7{fill:#f2f0f7;stroke:#f2f0f7;background:#f2f0f7}.Purples.q1-7{fill:#dadaeb;stroke:#dadaeb;background:#dadaeb}.Purples.q2-7{fill:#bcbddc;stroke:#bcbddc;background:#bcbddc}.Purples.q3-7{fill:#9e9ac8;stroke:#9e9ac8;background:#9e9ac8}.Purples.q4-7{fill:#807dba;stroke:#807dba;background:#807dba}.Purples.q5-7{fill:#6a51a3;stroke:#6a51a3;background:#6a51a3}.Purples.q6-7{fill:#4a1486;stroke:#4a1486;background:#4a1486}.Purples.q0-8{fill:#fcfbfd;stroke:#fcfbfd;background:#fcfbfd}.Purples.q1-8{fill:#efedf5;stroke:#efedf5;background:#efedf5}.Purples.q2-8{fill:#dadaeb;stroke:#dadaeb;background:#dadaeb}.Purples.q3-8{fill:#bcbddc;stroke:#bcbddc;background:#bcbddc}.Purples.q4-8{fill:#9e9ac8;stroke:#9e9ac8;background:#9e9ac8}.Purples.q5-8{fill:#807dba;stroke:#807dba;background:#807dba}.Purples.q6-8{fill:#6a51a3;stroke:#6a51a3;background:#6a51a3}.Purples.q7-8{fill:#4a1486;stroke:#4a1486;background:#4a1486}.Purples.q0-9{fill:#fcfbfd;stroke:#fcfbfd;background:#fcfbfd}.Purples.q1-9{fill:#efedf5;stroke:#efedf5;background:#efedf5}.Purples.q2-9{fill:#dadaeb;stroke:#dadaeb;background:#dadaeb}.Purples.q3-9{fill:#bcbddc;stroke:#bcbddc;background:#bcbddc}.Purples.q4-9{fill:#9e9ac8;stroke:#9e9ac8;background:#9e9ac8}.Purples.q5-9{fill:#807dba;stroke:#807dba;background:#807dba}.Purples.q6-9{fill:#6a51a3;stroke:#6a51a3;background:#6a51a3}.Purples.q7-9{fill:#54278f;stroke:#54278f;background:#54278f}.Purples.q8-9{fill:#3f007d;stroke:#3f007d;background:#3f007d}.Blues.q0-3{fill:#deebf7;stroke:#deebf7;background:#deebf7}.Blues.q1-3{fill:#9ecae1;stroke:#9ecae1;background:#9ecae1}.Blues.q2-3{fill:#3182bd;stroke:#3182bd;background:#3182bd}.Blues.q0-4{fill:#eff3ff;stroke:#eff3ff;background:#eff3ff}.Blues.q1-4{fill:#bdd7e7;stroke:#bdd7e7;background:#bdd7e7}.Blues.q2-4{fill:#6baed6;stroke:#6baed6;background:#6baed6}.Blues.q3-4{fill:#2171b5;stroke:#2171b5;background:#2171b5}.Blues.q0-5{fill:#eff3ff;stroke:#eff3ff;background:#eff3ff}.Blues.q1-5{fill:#bdd7e7;stroke:#bdd7e7;background:#bdd7e7}.Blues.q2-5{fill:#6baed6;stroke:#6baed6;background:#6baed6}.Blues.q3-5{fill:#3182bd;stroke:#3182bd;background:#3182bd}.Blues.q4-5{fill:#08519c;stroke:#08519c;background:#08519c}.Blues.q0-6{fill:#eff3ff;stroke:#eff3ff;background:#eff3ff}.Blues.q1-6{fill:#c6dbef;stroke:#c6dbef;background:#c6dbef}.Blues.q2-6{fill:#9ecae1;stroke:#9ecae1;background:#9ecae1}.Blues.q3-6{fill:#6baed6;stroke:#6baed6;background:#6baed6}.Blues.q4-6{fill:#3182bd;stroke:#3182bd;background:#3182bd}.Blues.q5-6{fill:#08519c;stroke:#08519c;background:#08519c}.Blues.q0-7{fill:#eff3ff;stroke:#eff3ff;background:#eff3ff}.Blues.q1-7{fill:#c6dbef;stroke:#c6dbef;background:#c6dbef}.Blues.q2-7{fill:#9ecae1;stroke:#9ecae1;background:#9ecae1}.Blues.q3-7{fill:#6baed6;stroke:#6baed6;background:#6baed6}.Blues.q4-7{fill:#4292c6;stroke:#4292c6;background:#4292c6}.Blues.q5-7{fill:#2171b5;stroke:#2171b5;background:#2171b5}.Blues.q6-7{fill:#084594;stroke:#084594;background:#084594}.Blues.q0-8{fill:#f7fbff;stroke:#f7fbff;background:#f7fbff}.Blues.q1-8{fill:#deebf7;stroke:#deebf7;background:#deebf7}.Blues.q2-8{fill:#c6dbef;stroke:#c6dbef;background:#c6dbef}.Blues.q3-8{fill:#9ecae1;stroke:#9ecae1;background:#9ecae1}.Blues.q4-8{fill:#6baed6;stroke:#6baed6;background:#6baed6}.Blues.q5-8{fill:#4292c6;stroke:#4292c6;background:#4292c6}.Blues.q6-8{fill:#2171b5;stroke:#2171b5;background:#2171b5}.Blues.q7-8{fill:#084594;stroke:#084594;background:#084594}.Blues.q0-9{fill:#f7fbff;stroke:#f7fbff;background:#f7fbff}.Blues.q1-9{fill:#deebf7;stroke:#deebf7;background:#deebf7}.Blues.q2-9{fill:#c6dbef;stroke:#c6dbef;background:#c6dbef}.Blues.q3-9{fill:#9ecae1;stroke:#9ecae1;background:#9ecae1}.Blues.q4-9{fill:#6baed6;stroke:#6baed6;background:#6baed6}.Blues.q5-9{fill:#4292c6;stroke:#4292c6;background:#4292c6}.Blues.q6-9{fill:#2171b5;stroke:#2171b5;background:#2171b5}.Blues.q7-9{fill:#08519c;stroke:#08519c;background:#08519c}.Blues.q8-9{fill:#08306b;stroke:#08306b;background:#08306b}.Greens.q0-3{fill:#e5f5e0;stroke:#e5f5e0;background:#e5f5e0}.Greens.q1-3{fill:#a1d99b;stroke:#a1d99b;background:#a1d99b}.Greens.q2-3{fill:#31a354;stroke:#31a354;background:#31a354}.Greens.q0-4{fill:#edf8e9;stroke:#edf8e9;background:#edf8e9}.Greens.q1-4{fill:#bae4b3;stroke:#bae4b3;background:#bae4b3}.Greens.q2-4{fill:#74c476;stroke:#74c476;background:#74c476}.Greens.q3-4{fill:#238b45;stroke:#238b45;background:#238b45}.Greens.q0-5{fill:#edf8e9;stroke:#edf8e9;background:#edf8e9}.Greens.q1-5{fill:#bae4b3;stroke:#bae4b3;background:#bae4b3}.Greens.q2-5{fill:#74c476;stroke:#74c476;background:#74c476}.Greens.q3-5{fill:#31a354;stroke:#31a354;background:#31a354}.Greens.q4-5{fill:#006d2c;stroke:#006d2c;background:#006d2c}.Greens.q0-6{fill:#edf8e9;stroke:#edf8e9;background:#edf8e9}.Greens.q1-6{fill:#c7e9c0;stroke:#c7e9c0;background:#c7e9c0}.Greens.q2-6{fill:#a1d99b;stroke:#a1d99b;background:#a1d99b}.Greens.q3-6{fill:#74c476;stroke:#74c476;background:#74c476}.Greens.q4-6{fill:#31a354;stroke:#31a354;background:#31a354}.Greens.q5-6{fill:#006d2c;stroke:#006d2c;background:#006d2c}.Greens.q0-7{fill:#edf8e9;stroke:#edf8e9;background:#edf8e9}.Greens.q1-7{fill:#c7e9c0;stroke:#c7e9c0;background:#c7e9c0}.Greens.q2-7{fill:#a1d99b;stroke:#a1d99b;background:#a1d99b}.Greens.q3-7{fill:#74c476;stroke:#74c476;background:#74c476}.Greens.q4-7{fill:#41ab5d;stroke:#41ab5d;background:#41ab5d}.Greens.q5-7{fill:#238b45;stroke:#238b45;background:#238b45}.Greens.q6-7{fill:#005a32;stroke:#005a32;background:#005a32}.Greens.q0-8{fill:#f7fcf5;stroke:#f7fcf5;background:#f7fcf5}.Greens.q1-8{fill:#e5f5e0;stroke:#e5f5e0;background:#e5f5e0}.Greens.q2-8{fill:#c7e9c0;stroke:#c7e9c0;background:#c7e9c0}.Greens.q3-8{fill:#a1d99b;stroke:#a1d99b;background:#a1d99b}.Greens.q4-8{fill:#74c476;stroke:#74c476;background:#74c476}.Greens.q5-8{fill:#41ab5d;stroke:#41ab5d;background:#41ab5d}.Greens.q6-8{fill:#238b45;stroke:#238b45;background:#238b45}.Greens.q7-8{fill:#005a32;stroke:#005a32;background:#005a32}.Greens.q0-9{fill:#f7fcf5;stroke:#f7fcf5;background:#f7fcf5}.Greens.q1-9{fill:#e5f5e0;stroke:#e5f5e0;background:#e5f5e0}.Greens.q2-9{fill:#c7e9c0;stroke:#c7e9c0;background:#c7e9c0}.Greens.q3-9{fill:#a1d99b;stroke:#a1d99b;background:#a1d99b}.Greens.q4-9{fill:#74c476;stroke:#74c476;background:#74c476}.Greens.q5-9{fill:#41ab5d;stroke:#41ab5d;background:#41ab5d}.Greens.q6-9{fill:#238b45;stroke:#238b45;background:#238b45}.Greens.q7-9{fill:#006d2c;stroke:#006d2c;background:#006d2c}.Greens.q8-9{fill:#00441b;stroke:#00441b;background:#00441b}.Oranges.q0-3{fill:#fee6ce;stroke:#fee6ce;background:#fee6ce}.Oranges.q1-3{fill:#fdae6b;stroke:#fdae6b;background:#fdae6b}.Oranges.q2-3{fill:#e6550d;stroke:#e6550d;background:#e6550d}.Oranges.q0-4{fill:#feedde;stroke:#feedde;background:#feedde}.Oranges.q1-4{fill:#fdbe85;stroke:#fdbe85;background:#fdbe85}.Oranges.q2-4{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.Oranges.q3-4{fill:#d94701;stroke:#d94701;background:#d94701}.Oranges.q0-5{fill:#feedde;stroke:#feedde;background:#feedde}.Oranges.q1-5{fill:#fdbe85;stroke:#fdbe85;background:#fdbe85}.Oranges.q2-5{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.Oranges.q3-5{fill:#e6550d;stroke:#e6550d;background:#e6550d}.Oranges.q4-5{fill:#a63603;stroke:#a63603;background:#a63603}.Oranges.q0-6{fill:#feedde;stroke:#feedde;background:#feedde}.Oranges.q1-6{fill:#fdd0a2;stroke:#fdd0a2;background:#fdd0a2}.Oranges.q2-6{fill:#fdae6b;stroke:#fdae6b;background:#fdae6b}.Oranges.q3-6{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.Oranges.q4-6{fill:#e6550d;stroke:#e6550d;background:#e6550d}.Oranges.q5-6{fill:#a63603;stroke:#a63603;background:#a63603}.Oranges.q0-7{fill:#feedde;stroke:#feedde;background:#feedde}.Oranges.q1-7{fill:#fdd0a2;stroke:#fdd0a2;background:#fdd0a2}.Oranges.q2-7{fill:#fdae6b;stroke:#fdae6b;background:#fdae6b}.Oranges.q3-7{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.Oranges.q4-7{fill:#f16913;stroke:#f16913;background:#f16913}.Oranges.q5-7{fill:#d94801;stroke:#d94801;background:#d94801}.Oranges.q6-7{fill:#8c2d04;stroke:#8c2d04;background:#8c2d04}.Oranges.q0-8{fill:#fff5eb;stroke:#fff5eb;background:#fff5eb}.Oranges.q1-8{fill:#fee6ce;stroke:#fee6ce;background:#fee6ce}.Oranges.q2-8{fill:#fdd0a2;stroke:#fdd0a2;background:#fdd0a2}.Oranges.q3-8{fill:#fdae6b;stroke:#fdae6b;background:#fdae6b}.Oranges.q4-8{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.Oranges.q5-8{fill:#f16913;stroke:#f16913;background:#f16913}.Oranges.q6-8{fill:#d94801;stroke:#d94801;background:#d94801}.Oranges.q7-8{fill:#8c2d04;stroke:#8c2d04;background:#8c2d04}.Oranges.q0-9{fill:#fff5eb;stroke:#fff5eb;background:#fff5eb}.Oranges.q1-9{fill:#fee6ce;stroke:#fee6ce;background:#fee6ce}.Oranges.q2-9{fill:#fdd0a2;stroke:#fdd0a2;background:#fdd0a2}.Oranges.q3-9{fill:#fdae6b;stroke:#fdae6b;background:#fdae6b}.Oranges.q4-9{fill:#fd8d3c;stroke:#fd8d3c;background:#fd8d3c}.Oranges.q5-9{fill:#f16913;stroke:#f16913;background:#f16913}.Oranges.q6-9{fill:#d94801;stroke:#d94801;background:#d94801}.Oranges.q7-9{fill:#a63603;stroke:#a63603;background:#a63603}.Oranges.q8-9{fill:#7f2704;stroke:#7f2704;background:#7f2704}.Reds.q0-3{fill:#fee0d2;stroke:#fee0d2;background:#fee0d2}.Reds.q1-3{fill:#fc9272;stroke:#fc9272;background:#fc9272}.Reds.q2-3{fill:#de2d26;stroke:#de2d26;background:#de2d26}.Reds.q0-4{fill:#fee5d9;stroke:#fee5d9;background:#fee5d9}.Reds.q1-4{fill:#fcae91;stroke:#fcae91;background:#fcae91}.Reds.q2-4{fill:#fb6a4a;stroke:#fb6a4a;background:#fb6a4a}.Reds.q3-4{fill:#cb181d;stroke:#cb181d;background:#cb181d}.Reds.q0-5{fill:#fee5d9;stroke:#fee5d9;background:#fee5d9}.Reds.q1-5{fill:#fcae91;stroke:#fcae91;background:#fcae91}.Reds.q2-5{fill:#fb6a4a;stroke:#fb6a4a;background:#fb6a4a}.Reds.q3-5{fill:#de2d26;stroke:#de2d26;background:#de2d26}.Reds.q4-5{fill:#a50f15;stroke:#a50f15;background:#a50f15}.Reds.q0-6{fill:#fee5d9;stroke:#fee5d9;background:#fee5d9}.Reds.q1-6{fill:#fcbba1;stroke:#fcbba1;background:#fcbba1}.Reds.q2-6{fill:#fc9272;stroke:#fc9272;background:#fc9272}.Reds.q3-6{fill:#fb6a4a;stroke:#fb6a4a;background:#fb6a4a}.Reds.q4-6{fill:#de2d26;stroke:#de2d26;background:#de2d26}.Reds.q5-6{fill:#a50f15;stroke:#a50f15;background:#a50f15}.Reds.q0-7{fill:#fee5d9;stroke:#fee5d9;background:#fee5d9}.Reds.q1-7{fill:#fcbba1;stroke:#fcbba1;background:#fcbba1}.Reds.q2-7{fill:#fc9272;stroke:#fc9272;background:#fc9272}.Reds.q3-7{fill:#fb6a4a;stroke:#fb6a4a;background:#fb6a4a}.Reds.q4-7{fill:#ef3b2c;stroke:#ef3b2c;background:#ef3b2c}.Reds.q5-7{fill:#cb181d;stroke:#cb181d;background:#cb181d}.Reds.q6-7{fill:#99000d;stroke:#99000d;background:#99000d}.Reds.q0-8{fill:#fff5f0;stroke:#fff5f0;background:#fff5f0}.Reds.q1-8{fill:#fee0d2;stroke:#fee0d2;background:#fee0d2}.Reds.q2-8{fill:#fcbba1;stroke:#fcbba1;background:#fcbba1}.Reds.q3-8{fill:#fc9272;stroke:#fc9272;background:#fc9272}.Reds.q4-8{fill:#fb6a4a;stroke:#fb6a4a;background:#fb6a4a}.Reds.q5-8{fill:#ef3b2c;stroke:#ef3b2c;background:#ef3b2c}.Reds.q6-8{fill:#cb181d;stroke:#cb181d;background:#cb181d}.Reds.q7-8{fill:#99000d;stroke:#99000d;background:#99000d}.Reds.q0-9{fill:#fff5f0;stroke:#fff5f0;background:#fff5f0}.Reds.q1-9{fill:#fee0d2;stroke:#fee0d2;background:#fee0d2}.Reds.q2-9{fill:#fcbba1;stroke:#fcbba1;background:#fcbba1}.Reds.q3-9{fill:#fc9272;stroke:#fc9272;background:#fc9272}.Reds.q4-9{fill:#fb6a4a;stroke:#fb6a4a;background:#fb6a4a}.Reds.q5-9{fill:#ef3b2c;stroke:#ef3b2c;background:#ef3b2c}.Reds.q6-9{fill:#cb181d;stroke:#cb181d;background:#cb181d}.Reds.q7-9{fill:#a50f15;stroke:#a50f15;background:#a50f15}.Reds.q8-9{fill:#67000d;stroke:#67000d;background:#67000d}.Greys.q0-3{fill:#f0f0f0;stroke:#f0f0f0;background:#f0f0f0}.Greys.q1-3{fill:#bdbdbd;stroke:#bdbdbd;background:#bdbdbd}.Greys.q2-3{fill:#636363;stroke:#636363;background:#636363}.Greys.q0-4{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.Greys.q1-4{fill:#ccc;stroke:#ccc;background:#ccc}.Greys.q2-4{fill:#969696;stroke:#969696;background:#969696}.Greys.q3-4{fill:#525252;stroke:#525252;background:#525252}.Greys.q0-5{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.Greys.q1-5{fill:#ccc;stroke:#ccc;background:#ccc}.Greys.q2-5{fill:#969696;stroke:#969696;background:#969696}.Greys.q3-5{fill:#636363;stroke:#636363;background:#636363}.Greys.q4-5{fill:#252525;stroke:#252525;background:#252525}.Greys.q0-6{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.Greys.q1-6{fill:#d9d9d9;stroke:#d9d9d9;background:#d9d9d9}.Greys.q2-6{fill:#bdbdbd;stroke:#bdbdbd;background:#bdbdbd}.Greys.q3-6{fill:#969696;stroke:#969696;background:#969696}.Greys.q4-6{fill:#636363;stroke:#636363;background:#636363}.Greys.q5-6{fill:#252525;stroke:#252525;background:#252525}.Greys.q0-7{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.Greys.q1-7{fill:#d9d9d9;stroke:#d9d9d9;background:#d9d9d9}.Greys.q2-7{fill:#bdbdbd;stroke:#bdbdbd;background:#bdbdbd}.Greys.q3-7{fill:#969696;stroke:#969696;background:#969696}.Greys.q4-7{fill:#737373;stroke:#737373;background:#737373}.Greys.q5-7{fill:#525252;stroke:#525252;background:#525252}.Greys.q6-7{fill:#252525;stroke:#252525;background:#252525}.Greys.q0-8{fill:#fff;stroke:#fff;background:#fff}.Greys.q1-8{fill:#f0f0f0;stroke:#f0f0f0;background:#f0f0f0}.Greys.q2-8{fill:#d9d9d9;stroke:#d9d9d9;background:#d9d9d9}.Greys.q3-8{fill:#bdbdbd;stroke:#bdbdbd;background:#bdbdbd}.Greys.q4-8{fill:#969696;stroke:#969696;background:#969696}.Greys.q5-8{fill:#737373;stroke:#737373;background:#737373}.Greys.q6-8{fill:#525252;stroke:#525252;background:#525252}.Greys.q7-8{fill:#252525;stroke:#252525;background:#252525}.Greys.q0-9{fill:#fff;stroke:#fff;background:#fff}.Greys.q1-9{fill:#f0f0f0;stroke:#f0f0f0;background:#f0f0f0}.Greys.q2-9{fill:#d9d9d9;stroke:#d9d9d9;background:#d9d9d9}.Greys.q3-9{fill:#bdbdbd;stroke:#bdbdbd;background:#bdbdbd}.Greys.q4-9{fill:#969696;stroke:#969696;background:#969696}.Greys.q5-9{fill:#737373;stroke:#737373;background:#737373}.Greys.q6-9{fill:#525252;stroke:#525252;background:#525252}.Greys.q7-9{fill:#252525;stroke:#252525;background:#252525}.Greys.q8-9{fill:#000;stroke:#000;background:#000}.PuOr.q0-3{fill:#f1a340;stroke:#f1a340;background:#f1a340}.PuOr.q1-3{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PuOr.q2-3{fill:#998ec3;stroke:#998ec3;background:#998ec3}.PuOr.q0-4{fill:#e66101;stroke:#e66101;background:#e66101}.PuOr.q1-4{fill:#fdb863;stroke:#fdb863;background:#fdb863}.PuOr.q2-4{fill:#b2abd2;stroke:#b2abd2;background:#b2abd2}.PuOr.q3-4{fill:#5e3c99;stroke:#5e3c99;background:#5e3c99}.PuOr.q0-5{fill:#e66101;stroke:#e66101;background:#e66101}.PuOr.q1-5{fill:#fdb863;stroke:#fdb863;background:#fdb863}.PuOr.q2-5{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PuOr.q3-5{fill:#b2abd2;stroke:#b2abd2;background:#b2abd2}.PuOr.q4-5{fill:#5e3c99;stroke:#5e3c99;background:#5e3c99}.PuOr.q0-6{fill:#b35806;stroke:#b35806;background:#b35806}.PuOr.q1-6{fill:#f1a340;stroke:#f1a340;background:#f1a340}.PuOr.q2-6{fill:#fee0b6;stroke:#fee0b6;background:#fee0b6}.PuOr.q3-6{fill:#d8daeb;stroke:#d8daeb;background:#d8daeb}.PuOr.q4-6{fill:#998ec3;stroke:#998ec3;background:#998ec3}.PuOr.q5-6{fill:#542788;stroke:#542788;background:#542788}.PuOr.q0-7{fill:#b35806;stroke:#b35806;background:#b35806}.PuOr.q1-7{fill:#f1a340;stroke:#f1a340;background:#f1a340}.PuOr.q2-7{fill:#fee0b6;stroke:#fee0b6;background:#fee0b6}.PuOr.q3-7{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PuOr.q4-7{fill:#d8daeb;stroke:#d8daeb;background:#d8daeb}.PuOr.q5-7{fill:#998ec3;stroke:#998ec3;background:#998ec3}.PuOr.q6-7{fill:#542788;stroke:#542788;background:#542788}.PuOr.q0-8{fill:#b35806;stroke:#b35806;background:#b35806}.PuOr.q1-8{fill:#e08214;stroke:#e08214;background:#e08214}.PuOr.q2-8{fill:#fdb863;stroke:#fdb863;background:#fdb863}.PuOr.q3-8{fill:#fee0b6;stroke:#fee0b6;background:#fee0b6}.PuOr.q4-8{fill:#d8daeb;stroke:#d8daeb;background:#d8daeb}.PuOr.q5-8{fill:#b2abd2;stroke:#b2abd2;background:#b2abd2}.PuOr.q6-8{fill:#8073ac;stroke:#8073ac;background:#8073ac}.PuOr.q7-8{fill:#542788;stroke:#542788;background:#542788}.PuOr.q0-9{fill:#b35806;stroke:#b35806;background:#b35806}.PuOr.q1-9{fill:#e08214;stroke:#e08214;background:#e08214}.PuOr.q2-9{fill:#fdb863;stroke:#fdb863;background:#fdb863}.PuOr.q3-9{fill:#fee0b6;stroke:#fee0b6;background:#fee0b6}.PuOr.q4-9{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PuOr.q5-9{fill:#d8daeb;stroke:#d8daeb;background:#d8daeb}.PuOr.q6-9{fill:#b2abd2;stroke:#b2abd2;background:#b2abd2}.PuOr.q7-9{fill:#8073ac;stroke:#8073ac;background:#8073ac}.PuOr.q8-9{fill:#542788;stroke:#542788;background:#542788}.PuOr.q0-10{fill:#7f3b08;stroke:#7f3b08;background:#7f3b08}.PuOr.q1-10{fill:#b35806;stroke:#b35806;background:#b35806}.PuOr.q2-10{fill:#e08214;stroke:#e08214;background:#e08214}.PuOr.q3-10{fill:#fdb863;stroke:#fdb863;background:#fdb863}.PuOr.q4-10{fill:#fee0b6;stroke:#fee0b6;background:#fee0b6}.PuOr.q5-10{fill:#d8daeb;stroke:#d8daeb;background:#d8daeb}.PuOr.q6-10{fill:#b2abd2;stroke:#b2abd2;background:#b2abd2}.PuOr.q7-10{fill:#8073ac;stroke:#8073ac;background:#8073ac}.PuOr.q8-10{fill:#542788;stroke:#542788;background:#542788}.PuOr.q9-10{fill:#2d004b;stroke:#2d004b;background:#2d004b}.PuOr.q0-11{fill:#7f3b08;stroke:#7f3b08;background:#7f3b08}.PuOr.q1-11{fill:#b35806;stroke:#b35806;background:#b35806}.PuOr.q2-11{fill:#e08214;stroke:#e08214;background:#e08214}.PuOr.q3-11{fill:#fdb863;stroke:#fdb863;background:#fdb863}.PuOr.q4-11{fill:#fee0b6;stroke:#fee0b6;background:#fee0b6}.PuOr.q5-11{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PuOr.q6-11{fill:#d8daeb;stroke:#d8daeb;background:#d8daeb}.PuOr.q7-11{fill:#b2abd2;stroke:#b2abd2;background:#b2abd2}.PuOr.q8-11{fill:#8073ac;stroke:#8073ac;background:#8073ac}.PuOr.q9-11{fill:#542788;stroke:#542788;background:#542788}.PuOr.q10-11{fill:#2d004b;stroke:#2d004b;background:#2d004b}.BrBG.q0-3{fill:#d8b365;stroke:#d8b365;background:#d8b365}.BrBG.q1-3{fill:#f5f5f5;stroke:#f5f5f5;background:#f5f5f5}.BrBG.q2-3{fill:#5ab4ac;stroke:#5ab4ac;background:#5ab4ac}.BrBG.q0-4{fill:#a6611a;stroke:#a6611a;background:#a6611a}.BrBG.q1-4{fill:#dfc27d;stroke:#dfc27d;background:#dfc27d}.BrBG.q2-4{fill:#80cdc1;stroke:#80cdc1;background:#80cdc1}.BrBG.q3-4{fill:#018571;stroke:#018571;background:#018571}.BrBG.q0-5{fill:#a6611a;stroke:#a6611a;background:#a6611a}.BrBG.q1-5{fill:#dfc27d;stroke:#dfc27d;background:#dfc27d}.BrBG.q2-5{fill:#f5f5f5;stroke:#f5f5f5;background:#f5f5f5}.BrBG.q3-5{fill:#80cdc1;stroke:#80cdc1;background:#80cdc1}.BrBG.q4-5{fill:#018571;stroke:#018571;background:#018571}.BrBG.q0-6{fill:#8c510a;stroke:#8c510a;background:#8c510a}.BrBG.q1-6{fill:#d8b365;stroke:#d8b365;background:#d8b365}.BrBG.q2-6{fill:#f6e8c3;stroke:#f6e8c3;background:#f6e8c3}.BrBG.q3-6{fill:#c7eae5;stroke:#c7eae5;background:#c7eae5}.BrBG.q4-6{fill:#5ab4ac;stroke:#5ab4ac;background:#5ab4ac}.BrBG.q5-6{fill:#01665e;stroke:#01665e;background:#01665e}.BrBG.q0-7{fill:#8c510a;stroke:#8c510a;background:#8c510a}.BrBG.q1-7{fill:#d8b365;stroke:#d8b365;background:#d8b365}.BrBG.q2-7{fill:#f6e8c3;stroke:#f6e8c3;background:#f6e8c3}.BrBG.q3-7{fill:#f5f5f5;stroke:#f5f5f5;background:#f5f5f5}.BrBG.q4-7{fill:#c7eae5;stroke:#c7eae5;background:#c7eae5}.BrBG.q5-7{fill:#5ab4ac;stroke:#5ab4ac;background:#5ab4ac}.BrBG.q6-7{fill:#01665e;stroke:#01665e;background:#01665e}.BrBG.q0-8{fill:#8c510a;stroke:#8c510a;background:#8c510a}.BrBG.q1-8{fill:#bf812d;stroke:#bf812d;background:#bf812d}.BrBG.q2-8{fill:#dfc27d;stroke:#dfc27d;background:#dfc27d}.BrBG.q3-8{fill:#f6e8c3;stroke:#f6e8c3;background:#f6e8c3}.BrBG.q4-8{fill:#c7eae5;stroke:#c7eae5;background:#c7eae5}.BrBG.q5-8{fill:#80cdc1;stroke:#80cdc1;background:#80cdc1}.BrBG.q6-8{fill:#35978f;stroke:#35978f;background:#35978f}.BrBG.q7-8{fill:#01665e;stroke:#01665e;background:#01665e}.BrBG.q0-9{fill:#8c510a;stroke:#8c510a;background:#8c510a}.BrBG.q1-9{fill:#bf812d;stroke:#bf812d;background:#bf812d}.BrBG.q2-9{fill:#dfc27d;stroke:#dfc27d;background:#dfc27d}.BrBG.q3-9{fill:#f6e8c3;stroke:#f6e8c3;background:#f6e8c3}.BrBG.q4-9{fill:#f5f5f5;stroke:#f5f5f5;background:#f5f5f5}.BrBG.q5-9{fill:#c7eae5;stroke:#c7eae5;background:#c7eae5}.BrBG.q6-9{fill:#80cdc1;stroke:#80cdc1;background:#80cdc1}.BrBG.q7-9{fill:#35978f;stroke:#35978f;background:#35978f}.BrBG.q8-9{fill:#01665e;stroke:#01665e;background:#01665e}.BrBG.q0-10{fill:#543005;stroke:#543005;background:#543005}.BrBG.q1-10{fill:#8c510a;stroke:#8c510a;background:#8c510a}.BrBG.q2-10{fill:#bf812d;stroke:#bf812d;background:#bf812d}.BrBG.q3-10{fill:#dfc27d;stroke:#dfc27d;background:#dfc27d}.BrBG.q4-10{fill:#f6e8c3;stroke:#f6e8c3;background:#f6e8c3}.BrBG.q5-10{fill:#c7eae5;stroke:#c7eae5;background:#c7eae5}.BrBG.q6-10{fill:#80cdc1;stroke:#80cdc1;background:#80cdc1}.BrBG.q7-10{fill:#35978f;stroke:#35978f;background:#35978f}.BrBG.q8-10{fill:#01665e;stroke:#01665e;background:#01665e}.BrBG.q9-10{fill:#003c30;stroke:#003c30;background:#003c30}.BrBG.q0-11{fill:#543005;stroke:#543005;background:#543005}.BrBG.q1-11{fill:#8c510a;stroke:#8c510a;background:#8c510a}.BrBG.q2-11{fill:#bf812d;stroke:#bf812d;background:#bf812d}.BrBG.q3-11{fill:#dfc27d;stroke:#dfc27d;background:#dfc27d}.BrBG.q4-11{fill:#f6e8c3;stroke:#f6e8c3;background:#f6e8c3}.BrBG.q5-11{fill:#f5f5f5;stroke:#f5f5f5;background:#f5f5f5}.BrBG.q6-11{fill:#c7eae5;stroke:#c7eae5;background:#c7eae5}.BrBG.q7-11{fill:#80cdc1;stroke:#80cdc1;background:#80cdc1}.BrBG.q8-11{fill:#35978f;stroke:#35978f;background:#35978f}.BrBG.q9-11{fill:#01665e;stroke:#01665e;background:#01665e}.BrBG.q10-11{fill:#003c30;stroke:#003c30;background:#003c30}.PRGn.q0-3{fill:#af8dc3;stroke:#af8dc3;background:#af8dc3}.PRGn.q1-3{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PRGn.q2-3{fill:#7fbf7b;stroke:#7fbf7b;background:#7fbf7b}.PRGn.q0-4{fill:#7b3294;stroke:#7b3294;background:#7b3294}.PRGn.q1-4{fill:#c2a5cf;stroke:#c2a5cf;background:#c2a5cf}.PRGn.q2-4{fill:#a6dba0;stroke:#a6dba0;background:#a6dba0}.PRGn.q3-4{fill:#008837;stroke:#008837;background:#008837}.PRGn.q0-5{fill:#7b3294;stroke:#7b3294;background:#7b3294}.PRGn.q1-5{fill:#c2a5cf;stroke:#c2a5cf;background:#c2a5cf}.PRGn.q2-5{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PRGn.q3-5{fill:#a6dba0;stroke:#a6dba0;background:#a6dba0}.PRGn.q4-5{fill:#008837;stroke:#008837;background:#008837}.PRGn.q0-6{fill:#762a83;stroke:#762a83;background:#762a83}.PRGn.q1-6{fill:#af8dc3;stroke:#af8dc3;background:#af8dc3}.PRGn.q2-6{fill:#e7d4e8;stroke:#e7d4e8;background:#e7d4e8}.PRGn.q3-6{fill:#d9f0d3;stroke:#d9f0d3;background:#d9f0d3}.PRGn.q4-6{fill:#7fbf7b;stroke:#7fbf7b;background:#7fbf7b}.PRGn.q5-6{fill:#1b7837;stroke:#1b7837;background:#1b7837}.PRGn.q0-7{fill:#762a83;stroke:#762a83;background:#762a83}.PRGn.q1-7{fill:#af8dc3;stroke:#af8dc3;background:#af8dc3}.PRGn.q2-7{fill:#e7d4e8;stroke:#e7d4e8;background:#e7d4e8}.PRGn.q3-7{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PRGn.q4-7{fill:#d9f0d3;stroke:#d9f0d3;background:#d9f0d3}.PRGn.q5-7{fill:#7fbf7b;stroke:#7fbf7b;background:#7fbf7b}.PRGn.q6-7{fill:#1b7837;stroke:#1b7837;background:#1b7837}.PRGn.q0-8{fill:#762a83;stroke:#762a83;background:#762a83}.PRGn.q1-8{fill:#9970ab;stroke:#9970ab;background:#9970ab}.PRGn.q2-8{fill:#c2a5cf;stroke:#c2a5cf;background:#c2a5cf}.PRGn.q3-8{fill:#e7d4e8;stroke:#e7d4e8;background:#e7d4e8}.PRGn.q4-8{fill:#d9f0d3;stroke:#d9f0d3;background:#d9f0d3}.PRGn.q5-8{fill:#a6dba0;stroke:#a6dba0;background:#a6dba0}.PRGn.q6-8{fill:#5aae61;stroke:#5aae61;background:#5aae61}.PRGn.q7-8{fill:#1b7837;stroke:#1b7837;background:#1b7837}.PRGn.q0-9{fill:#762a83;stroke:#762a83;background:#762a83}.PRGn.q1-9{fill:#9970ab;stroke:#9970ab;background:#9970ab}.PRGn.q2-9{fill:#c2a5cf;stroke:#c2a5cf;background:#c2a5cf}.PRGn.q3-9{fill:#e7d4e8;stroke:#e7d4e8;background:#e7d4e8}.PRGn.q4-9{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PRGn.q5-9{fill:#d9f0d3;stroke:#d9f0d3;background:#d9f0d3}.PRGn.q6-9{fill:#a6dba0;stroke:#a6dba0;background:#a6dba0}.PRGn.q7-9{fill:#5aae61;stroke:#5aae61;background:#5aae61}.PRGn.q8-9{fill:#1b7837;stroke:#1b7837;background:#1b7837}.PRGn.q0-10{fill:#40004b;stroke:#40004b;background:#40004b}.PRGn.q1-10{fill:#762a83;stroke:#762a83;background:#762a83}.PRGn.q2-10{fill:#9970ab;stroke:#9970ab;background:#9970ab}.PRGn.q3-10{fill:#c2a5cf;stroke:#c2a5cf;background:#c2a5cf}.PRGn.q4-10{fill:#e7d4e8;stroke:#e7d4e8;background:#e7d4e8}.PRGn.q5-10{fill:#d9f0d3;stroke:#d9f0d3;background:#d9f0d3}.PRGn.q6-10{fill:#a6dba0;stroke:#a6dba0;background:#a6dba0}.PRGn.q7-10{fill:#5aae61;stroke:#5aae61;background:#5aae61}.PRGn.q8-10{fill:#1b7837;stroke:#1b7837;background:#1b7837}.PRGn.q9-10{fill:#00441b;stroke:#00441b;background:#00441b}.PRGn.q0-11{fill:#40004b;stroke:#40004b;background:#40004b}.PRGn.q1-11{fill:#762a83;stroke:#762a83;background:#762a83}.PRGn.q2-11{fill:#9970ab;stroke:#9970ab;background:#9970ab}.PRGn.q3-11{fill:#c2a5cf;stroke:#c2a5cf;background:#c2a5cf}.PRGn.q4-11{fill:#e7d4e8;stroke:#e7d4e8;background:#e7d4e8}.PRGn.q5-11{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PRGn.q6-11{fill:#d9f0d3;stroke:#d9f0d3;background:#d9f0d3}.PRGn.q7-11{fill:#a6dba0;stroke:#a6dba0;background:#a6dba0}.PRGn.q8-11{fill:#5aae61;stroke:#5aae61;background:#5aae61}.PRGn.q9-11{fill:#1b7837;stroke:#1b7837;background:#1b7837}.PRGn.q10-11{fill:#00441b;stroke:#00441b;background:#00441b}.PiYG.q0-3{fill:#e9a3c9;stroke:#e9a3c9;background:#e9a3c9}.PiYG.q1-3{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PiYG.q2-3{fill:#a1d76a;stroke:#a1d76a;background:#a1d76a}.PiYG.q0-4{fill:#d01c8b;stroke:#d01c8b;background:#d01c8b}.PiYG.q1-4{fill:#f1b6da;stroke:#f1b6da;background:#f1b6da}.PiYG.q2-4{fill:#b8e186;stroke:#b8e186;background:#b8e186}.PiYG.q3-4{fill:#4dac26;stroke:#4dac26;background:#4dac26}.PiYG.q0-5{fill:#d01c8b;stroke:#d01c8b;background:#d01c8b}.PiYG.q1-5{fill:#f1b6da;stroke:#f1b6da;background:#f1b6da}.PiYG.q2-5{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PiYG.q3-5{fill:#b8e186;stroke:#b8e186;background:#b8e186}.PiYG.q4-5{fill:#4dac26;stroke:#4dac26;background:#4dac26}.PiYG.q0-6{fill:#c51b7d;stroke:#c51b7d;background:#c51b7d}.PiYG.q1-6{fill:#e9a3c9;stroke:#e9a3c9;background:#e9a3c9}.PiYG.q2-6{fill:#fde0ef;stroke:#fde0ef;background:#fde0ef}.PiYG.q3-6{fill:#e6f5d0;stroke:#e6f5d0;background:#e6f5d0}.PiYG.q4-6{fill:#a1d76a;stroke:#a1d76a;background:#a1d76a}.PiYG.q5-6{fill:#4d9221;stroke:#4d9221;background:#4d9221}.PiYG.q0-7{fill:#c51b7d;stroke:#c51b7d;background:#c51b7d}.PiYG.q1-7{fill:#e9a3c9;stroke:#e9a3c9;background:#e9a3c9}.PiYG.q2-7{fill:#fde0ef;stroke:#fde0ef;background:#fde0ef}.PiYG.q3-7{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PiYG.q4-7{fill:#e6f5d0;stroke:#e6f5d0;background:#e6f5d0}.PiYG.q5-7{fill:#a1d76a;stroke:#a1d76a;background:#a1d76a}.PiYG.q6-7{fill:#4d9221;stroke:#4d9221;background:#4d9221}.PiYG.q0-8{fill:#c51b7d;stroke:#c51b7d;background:#c51b7d}.PiYG.q1-8{fill:#de77ae;stroke:#de77ae;background:#de77ae}.PiYG.q2-8{fill:#f1b6da;stroke:#f1b6da;background:#f1b6da}.PiYG.q3-8{fill:#fde0ef;stroke:#fde0ef;background:#fde0ef}.PiYG.q4-8{fill:#e6f5d0;stroke:#e6f5d0;background:#e6f5d0}.PiYG.q5-8{fill:#b8e186;stroke:#b8e186;background:#b8e186}.PiYG.q6-8{fill:#7fbc41;stroke:#7fbc41;background:#7fbc41}.PiYG.q7-8{fill:#4d9221;stroke:#4d9221;background:#4d9221}.PiYG.q0-9{fill:#c51b7d;stroke:#c51b7d;background:#c51b7d}.PiYG.q1-9{fill:#de77ae;stroke:#de77ae;background:#de77ae}.PiYG.q2-9{fill:#f1b6da;stroke:#f1b6da;background:#f1b6da}.PiYG.q3-9{fill:#fde0ef;stroke:#fde0ef;background:#fde0ef}.PiYG.q4-9{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PiYG.q5-9{fill:#e6f5d0;stroke:#e6f5d0;background:#e6f5d0}.PiYG.q6-9{fill:#b8e186;stroke:#b8e186;background:#b8e186}.PiYG.q7-9{fill:#7fbc41;stroke:#7fbc41;background:#7fbc41}.PiYG.q8-9{fill:#4d9221;stroke:#4d9221;background:#4d9221}.PiYG.q0-10{fill:#8e0152;stroke:#8e0152;background:#8e0152}.PiYG.q1-10{fill:#c51b7d;stroke:#c51b7d;background:#c51b7d}.PiYG.q2-10{fill:#de77ae;stroke:#de77ae;background:#de77ae}.PiYG.q3-10{fill:#f1b6da;stroke:#f1b6da;background:#f1b6da}.PiYG.q4-10{fill:#fde0ef;stroke:#fde0ef;background:#fde0ef}.PiYG.q5-10{fill:#e6f5d0;stroke:#e6f5d0;background:#e6f5d0}.PiYG.q6-10{fill:#b8e186;stroke:#b8e186;background:#b8e186}.PiYG.q7-10{fill:#7fbc41;stroke:#7fbc41;background:#7fbc41}.PiYG.q8-10{fill:#4d9221;stroke:#4d9221;background:#4d9221}.PiYG.q9-10{fill:#276419;stroke:#276419;background:#276419}.PiYG.q0-11{fill:#8e0152;stroke:#8e0152;background:#8e0152}.PiYG.q1-11{fill:#c51b7d;stroke:#c51b7d;background:#c51b7d}.PiYG.q2-11{fill:#de77ae;stroke:#de77ae;background:#de77ae}.PiYG.q3-11{fill:#f1b6da;stroke:#f1b6da;background:#f1b6da}.PiYG.q4-11{fill:#fde0ef;stroke:#fde0ef;background:#fde0ef}.PiYG.q5-11{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.PiYG.q6-11{fill:#e6f5d0;stroke:#e6f5d0;background:#e6f5d0}.PiYG.q7-11{fill:#b8e186;stroke:#b8e186;background:#b8e186}.PiYG.q8-11{fill:#7fbc41;stroke:#7fbc41;background:#7fbc41}.PiYG.q9-11{fill:#4d9221;stroke:#4d9221;background:#4d9221}.PiYG.q10-11{fill:#276419;stroke:#276419;background:#276419}.RdBu.q0-3{fill:#ef8a62;stroke:#ef8a62;background:#ef8a62}.RdBu.q1-3{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.RdBu.q2-3{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.RdBu.q0-4{fill:#ca0020;stroke:#ca0020;background:#ca0020}.RdBu.q1-4{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdBu.q2-4{fill:#92c5de;stroke:#92c5de;background:#92c5de}.RdBu.q3-4{fill:#0571b0;stroke:#0571b0;background:#0571b0}.RdBu.q0-5{fill:#ca0020;stroke:#ca0020;background:#ca0020}.RdBu.q1-5{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdBu.q2-5{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.RdBu.q3-5{fill:#92c5de;stroke:#92c5de;background:#92c5de}.RdBu.q4-5{fill:#0571b0;stroke:#0571b0;background:#0571b0}.RdBu.q0-6{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdBu.q1-6{fill:#ef8a62;stroke:#ef8a62;background:#ef8a62}.RdBu.q2-6{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdBu.q3-6{fill:#d1e5f0;stroke:#d1e5f0;background:#d1e5f0}.RdBu.q4-6{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.RdBu.q5-6{fill:#2166ac;stroke:#2166ac;background:#2166ac}.RdBu.q0-7{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdBu.q1-7{fill:#ef8a62;stroke:#ef8a62;background:#ef8a62}.RdBu.q2-7{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdBu.q3-7{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.RdBu.q4-7{fill:#d1e5f0;stroke:#d1e5f0;background:#d1e5f0}.RdBu.q5-7{fill:#67a9cf;stroke:#67a9cf;background:#67a9cf}.RdBu.q6-7{fill:#2166ac;stroke:#2166ac;background:#2166ac}.RdBu.q0-8{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdBu.q1-8{fill:#d6604d;stroke:#d6604d;background:#d6604d}.RdBu.q2-8{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdBu.q3-8{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdBu.q4-8{fill:#d1e5f0;stroke:#d1e5f0;background:#d1e5f0}.RdBu.q5-8{fill:#92c5de;stroke:#92c5de;background:#92c5de}.RdBu.q6-8{fill:#4393c3;stroke:#4393c3;background:#4393c3}.RdBu.q7-8{fill:#2166ac;stroke:#2166ac;background:#2166ac}.RdBu.q0-9{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdBu.q1-9{fill:#d6604d;stroke:#d6604d;background:#d6604d}.RdBu.q2-9{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdBu.q3-9{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdBu.q4-9{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.RdBu.q5-9{fill:#d1e5f0;stroke:#d1e5f0;background:#d1e5f0}.RdBu.q6-9{fill:#92c5de;stroke:#92c5de;background:#92c5de}.RdBu.q7-9{fill:#4393c3;stroke:#4393c3;background:#4393c3}.RdBu.q8-9{fill:#2166ac;stroke:#2166ac;background:#2166ac}.RdBu.q0-10{fill:#67001f;stroke:#67001f;background:#67001f}.RdBu.q1-10{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdBu.q2-10{fill:#d6604d;stroke:#d6604d;background:#d6604d}.RdBu.q3-10{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdBu.q4-10{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdBu.q5-10{fill:#d1e5f0;stroke:#d1e5f0;background:#d1e5f0}.RdBu.q6-10{fill:#92c5de;stroke:#92c5de;background:#92c5de}.RdBu.q7-10{fill:#4393c3;stroke:#4393c3;background:#4393c3}.RdBu.q8-10{fill:#2166ac;stroke:#2166ac;background:#2166ac}.RdBu.q9-10{fill:#053061;stroke:#053061;background:#053061}.RdBu.q0-11{fill:#67001f;stroke:#67001f;background:#67001f}.RdBu.q1-11{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdBu.q2-11{fill:#d6604d;stroke:#d6604d;background:#d6604d}.RdBu.q3-11{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdBu.q4-11{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdBu.q5-11{fill:#f7f7f7;stroke:#f7f7f7;background:#f7f7f7}.RdBu.q6-11{fill:#d1e5f0;stroke:#d1e5f0;background:#d1e5f0}.RdBu.q7-11{fill:#92c5de;stroke:#92c5de;background:#92c5de}.RdBu.q8-11{fill:#4393c3;stroke:#4393c3;background:#4393c3}.RdBu.q9-11{fill:#2166ac;stroke:#2166ac;background:#2166ac}.RdBu.q10-11{fill:#053061;stroke:#053061;background:#053061}.RdGy.q0-3{fill:#ef8a62;stroke:#ef8a62;background:#ef8a62}.RdGy.q1-3{fill:#fff;stroke:#fff;background:#fff}.RdGy.q2-3{fill:#999;stroke:#999;background:#999}.RdGy.q0-4{fill:#ca0020;stroke:#ca0020;background:#ca0020}.RdGy.q1-4{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdGy.q2-4{fill:#bababa;stroke:#bababa;background:#bababa}.RdGy.q3-4{fill:#404040;stroke:#404040;background:#404040}.RdGy.q0-5{fill:#ca0020;stroke:#ca0020;background:#ca0020}.RdGy.q1-5{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdGy.q2-5{fill:#fff;stroke:#fff;background:#fff}.RdGy.q3-5{fill:#bababa;stroke:#bababa;background:#bababa}.RdGy.q4-5{fill:#404040;stroke:#404040;background:#404040}.RdGy.q0-6{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdGy.q1-6{fill:#ef8a62;stroke:#ef8a62;background:#ef8a62}.RdGy.q2-6{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdGy.q3-6{fill:#e0e0e0;stroke:#e0e0e0;background:#e0e0e0}.RdGy.q4-6{fill:#999;stroke:#999;background:#999}.RdGy.q5-6{fill:#4d4d4d;stroke:#4d4d4d;background:#4d4d4d}.RdGy.q0-7{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdGy.q1-7{fill:#ef8a62;stroke:#ef8a62;background:#ef8a62}.RdGy.q2-7{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdGy.q3-7{fill:#fff;stroke:#fff;background:#fff}.RdGy.q4-7{fill:#e0e0e0;stroke:#e0e0e0;background:#e0e0e0}.RdGy.q5-7{fill:#999;stroke:#999;background:#999}.RdGy.q6-7{fill:#4d4d4d;stroke:#4d4d4d;background:#4d4d4d}.RdGy.q0-8{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdGy.q1-8{fill:#d6604d;stroke:#d6604d;background:#d6604d}.RdGy.q2-8{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdGy.q3-8{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdGy.q4-8{fill:#e0e0e0;stroke:#e0e0e0;background:#e0e0e0}.RdGy.q5-8{fill:#bababa;stroke:#bababa;background:#bababa}.RdGy.q6-8{fill:#878787;stroke:#878787;background:#878787}.RdGy.q7-8{fill:#4d4d4d;stroke:#4d4d4d;background:#4d4d4d}.RdGy.q0-9{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdGy.q1-9{fill:#d6604d;stroke:#d6604d;background:#d6604d}.RdGy.q2-9{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdGy.q3-9{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdGy.q4-9{fill:#fff;stroke:#fff;background:#fff}.RdGy.q5-9{fill:#e0e0e0;stroke:#e0e0e0;background:#e0e0e0}.RdGy.q6-9{fill:#bababa;stroke:#bababa;background:#bababa}.RdGy.q7-9{fill:#878787;stroke:#878787;background:#878787}.RdGy.q8-9{fill:#4d4d4d;stroke:#4d4d4d;background:#4d4d4d}.RdGy.q0-10{fill:#67001f;stroke:#67001f;background:#67001f}.RdGy.q1-10{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdGy.q2-10{fill:#d6604d;stroke:#d6604d;background:#d6604d}.RdGy.q3-10{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdGy.q4-10{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdGy.q5-10{fill:#e0e0e0;stroke:#e0e0e0;background:#e0e0e0}.RdGy.q6-10{fill:#bababa;stroke:#bababa;background:#bababa}.RdGy.q7-10{fill:#878787;stroke:#878787;background:#878787}.RdGy.q8-10{fill:#4d4d4d;stroke:#4d4d4d;background:#4d4d4d}.RdGy.q9-10{fill:#1a1a1a;stroke:#1a1a1a;background:#1a1a1a}.RdGy.q0-11{fill:#67001f;stroke:#67001f;background:#67001f}.RdGy.q1-11{fill:#b2182b;stroke:#b2182b;background:#b2182b}.RdGy.q2-11{fill:#d6604d;stroke:#d6604d;background:#d6604d}.RdGy.q3-11{fill:#f4a582;stroke:#f4a582;background:#f4a582}.RdGy.q4-11{fill:#fddbc7;stroke:#fddbc7;background:#fddbc7}.RdGy.q5-11{fill:#fff;stroke:#fff;background:#fff}.RdGy.q6-11{fill:#e0e0e0;stroke:#e0e0e0;background:#e0e0e0}.RdGy.q7-11{fill:#bababa;stroke:#bababa;background:#bababa}.RdGy.q8-11{fill:#878787;stroke:#878787;background:#878787}.RdGy.q9-11{fill:#4d4d4d;stroke:#4d4d4d;background:#4d4d4d}.RdGy.q10-11{fill:#1a1a1a;stroke:#1a1a1a;background:#1a1a1a}.RdYlBu.q0-3{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.RdYlBu.q1-3{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlBu.q2-3{fill:#91bfdb;stroke:#91bfdb;background:#91bfdb}.RdYlBu.q0-4{fill:#d7191c;stroke:#d7191c;background:#d7191c}.RdYlBu.q1-4{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlBu.q2-4{fill:#abd9e9;stroke:#abd9e9;background:#abd9e9}.RdYlBu.q3-4{fill:#2c7bb6;stroke:#2c7bb6;background:#2c7bb6}.RdYlBu.q0-5{fill:#d7191c;stroke:#d7191c;background:#d7191c}.RdYlBu.q1-5{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlBu.q2-5{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlBu.q3-5{fill:#abd9e9;stroke:#abd9e9;background:#abd9e9}.RdYlBu.q4-5{fill:#2c7bb6;stroke:#2c7bb6;background:#2c7bb6}.RdYlBu.q0-6{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlBu.q1-6{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.RdYlBu.q2-6{fill:#fee090;stroke:#fee090;background:#fee090}.RdYlBu.q3-6{fill:#e0f3f8;stroke:#e0f3f8;background:#e0f3f8}.RdYlBu.q4-6{fill:#91bfdb;stroke:#91bfdb;background:#91bfdb}.RdYlBu.q5-6{fill:#4575b4;stroke:#4575b4;background:#4575b4}.RdYlBu.q0-7{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlBu.q1-7{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.RdYlBu.q2-7{fill:#fee090;stroke:#fee090;background:#fee090}.RdYlBu.q3-7{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlBu.q4-7{fill:#e0f3f8;stroke:#e0f3f8;background:#e0f3f8}.RdYlBu.q5-7{fill:#91bfdb;stroke:#91bfdb;background:#91bfdb}.RdYlBu.q6-7{fill:#4575b4;stroke:#4575b4;background:#4575b4}.RdYlBu.q0-8{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlBu.q1-8{fill:#f46d43;stroke:#f46d43;background:#f46d43}.RdYlBu.q2-8{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlBu.q3-8{fill:#fee090;stroke:#fee090;background:#fee090}.RdYlBu.q4-8{fill:#e0f3f8;stroke:#e0f3f8;background:#e0f3f8}.RdYlBu.q5-8{fill:#abd9e9;stroke:#abd9e9;background:#abd9e9}.RdYlBu.q6-8{fill:#74add1;stroke:#74add1;background:#74add1}.RdYlBu.q7-8{fill:#4575b4;stroke:#4575b4;background:#4575b4}.RdYlBu.q0-9{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlBu.q1-9{fill:#f46d43;stroke:#f46d43;background:#f46d43}.RdYlBu.q2-9{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlBu.q3-9{fill:#fee090;stroke:#fee090;background:#fee090}.RdYlBu.q4-9{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlBu.q5-9{fill:#e0f3f8;stroke:#e0f3f8;background:#e0f3f8}.RdYlBu.q6-9{fill:#abd9e9;stroke:#abd9e9;background:#abd9e9}.RdYlBu.q7-9{fill:#74add1;stroke:#74add1;background:#74add1}.RdYlBu.q8-9{fill:#4575b4;stroke:#4575b4;background:#4575b4}.RdYlBu.q0-10{fill:#a50026;stroke:#a50026;background:#a50026}.RdYlBu.q1-10{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlBu.q2-10{fill:#f46d43;stroke:#f46d43;background:#f46d43}.RdYlBu.q3-10{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlBu.q4-10{fill:#fee090;stroke:#fee090;background:#fee090}.RdYlBu.q5-10{fill:#e0f3f8;stroke:#e0f3f8;background:#e0f3f8}.RdYlBu.q6-10{fill:#abd9e9;stroke:#abd9e9;background:#abd9e9}.RdYlBu.q7-10{fill:#74add1;stroke:#74add1;background:#74add1}.RdYlBu.q8-10{fill:#4575b4;stroke:#4575b4;background:#4575b4}.RdYlBu.q9-10{fill:#313695;stroke:#313695;background:#313695}.RdYlBu.q0-11{fill:#a50026;stroke:#a50026;background:#a50026}.RdYlBu.q1-11{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlBu.q2-11{fill:#f46d43;stroke:#f46d43;background:#f46d43}.RdYlBu.q3-11{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlBu.q4-11{fill:#fee090;stroke:#fee090;background:#fee090}.RdYlBu.q5-11{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlBu.q6-11{fill:#e0f3f8;stroke:#e0f3f8;background:#e0f3f8}.RdYlBu.q7-11{fill:#abd9e9;stroke:#abd9e9;background:#abd9e9}.RdYlBu.q8-11{fill:#74add1;stroke:#74add1;background:#74add1}.RdYlBu.q9-11{fill:#4575b4;stroke:#4575b4;background:#4575b4}.RdYlBu.q10-11{fill:#313695;stroke:#313695;background:#313695}.Spectral.q0-3{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.Spectral.q1-3{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.Spectral.q2-3{fill:#99d594;stroke:#99d594;background:#99d594}.Spectral.q0-4{fill:#d7191c;stroke:#d7191c;background:#d7191c}.Spectral.q1-4{fill:#fdae61;stroke:#fdae61;background:#fdae61}.Spectral.q2-4{fill:#abdda4;stroke:#abdda4;background:#abdda4}.Spectral.q3-4{fill:#2b83ba;stroke:#2b83ba;background:#2b83ba}.Spectral.q0-5{fill:#d7191c;stroke:#d7191c;background:#d7191c}.Spectral.q1-5{fill:#fdae61;stroke:#fdae61;background:#fdae61}.Spectral.q2-5{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.Spectral.q3-5{fill:#abdda4;stroke:#abdda4;background:#abdda4}.Spectral.q4-5{fill:#2b83ba;stroke:#2b83ba;background:#2b83ba}.Spectral.q0-6{fill:#d53e4f;stroke:#d53e4f;background:#d53e4f}.Spectral.q1-6{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.Spectral.q2-6{fill:#fee08b;stroke:#fee08b;background:#fee08b}.Spectral.q3-6{fill:#e6f598;stroke:#e6f598;background:#e6f598}.Spectral.q4-6{fill:#99d594;stroke:#99d594;background:#99d594}.Spectral.q5-6{fill:#3288bd;stroke:#3288bd;background:#3288bd}.Spectral.q0-7{fill:#d53e4f;stroke:#d53e4f;background:#d53e4f}.Spectral.q1-7{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.Spectral.q2-7{fill:#fee08b;stroke:#fee08b;background:#fee08b}.Spectral.q3-7{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.Spectral.q4-7{fill:#e6f598;stroke:#e6f598;background:#e6f598}.Spectral.q5-7{fill:#99d594;stroke:#99d594;background:#99d594}.Spectral.q6-7{fill:#3288bd;stroke:#3288bd;background:#3288bd}.Spectral.q0-8{fill:#d53e4f;stroke:#d53e4f;background:#d53e4f}.Spectral.q1-8{fill:#f46d43;stroke:#f46d43;background:#f46d43}.Spectral.q2-8{fill:#fdae61;stroke:#fdae61;background:#fdae61}.Spectral.q3-8{fill:#fee08b;stroke:#fee08b;background:#fee08b}.Spectral.q4-8{fill:#e6f598;stroke:#e6f598;background:#e6f598}.Spectral.q5-8{fill:#abdda4;stroke:#abdda4;background:#abdda4}.Spectral.q6-8{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Spectral.q7-8{fill:#3288bd;stroke:#3288bd;background:#3288bd}.Spectral.q0-9{fill:#d53e4f;stroke:#d53e4f;background:#d53e4f}.Spectral.q1-9{fill:#f46d43;stroke:#f46d43;background:#f46d43}.Spectral.q2-9{fill:#fdae61;stroke:#fdae61;background:#fdae61}.Spectral.q3-9{fill:#fee08b;stroke:#fee08b;background:#fee08b}.Spectral.q4-9{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.Spectral.q5-9{fill:#e6f598;stroke:#e6f598;background:#e6f598}.Spectral.q6-9{fill:#abdda4;stroke:#abdda4;background:#abdda4}.Spectral.q7-9{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Spectral.q8-9{fill:#3288bd;stroke:#3288bd;background:#3288bd}.Spectral.q0-10{fill:#9e0142;stroke:#9e0142;background:#9e0142}.Spectral.q1-10{fill:#d53e4f;stroke:#d53e4f;background:#d53e4f}.Spectral.q2-10{fill:#f46d43;stroke:#f46d43;background:#f46d43}.Spectral.q3-10{fill:#fdae61;stroke:#fdae61;background:#fdae61}.Spectral.q4-10{fill:#fee08b;stroke:#fee08b;background:#fee08b}.Spectral.q5-10{fill:#e6f598;stroke:#e6f598;background:#e6f598}.Spectral.q6-10{fill:#abdda4;stroke:#abdda4;background:#abdda4}.Spectral.q7-10{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Spectral.q8-10{fill:#3288bd;stroke:#3288bd;background:#3288bd}.Spectral.q9-10{fill:#5e4fa2;stroke:#5e4fa2;background:#5e4fa2}.Spectral.q0-11{fill:#9e0142;stroke:#9e0142;background:#9e0142}.Spectral.q1-11{fill:#d53e4f;stroke:#d53e4f;background:#d53e4f}.Spectral.q2-11{fill:#f46d43;stroke:#f46d43;background:#f46d43}.Spectral.q3-11{fill:#fdae61;stroke:#fdae61;background:#fdae61}.Spectral.q4-11{fill:#fee08b;stroke:#fee08b;background:#fee08b}.Spectral.q5-11{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.Spectral.q6-11{fill:#e6f598;stroke:#e6f598;background:#e6f598}.Spectral.q7-11{fill:#abdda4;stroke:#abdda4;background:#abdda4}.Spectral.q8-11{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Spectral.q9-11{fill:#3288bd;stroke:#3288bd;background:#3288bd}.Spectral.q10-11{fill:#5e4fa2;stroke:#5e4fa2;background:#5e4fa2}.RdYlGn.q0-3{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.RdYlGn.q1-3{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlGn.q2-3{fill:#91cf60;stroke:#91cf60;background:#91cf60}.RdYlGn.q0-4{fill:#d7191c;stroke:#d7191c;background:#d7191c}.RdYlGn.q1-4{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlGn.q2-4{fill:#a6d96a;stroke:#a6d96a;background:#a6d96a}.RdYlGn.q3-4{fill:#1a9641;stroke:#1a9641;background:#1a9641}.RdYlGn.q0-5{fill:#d7191c;stroke:#d7191c;background:#d7191c}.RdYlGn.q1-5{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlGn.q2-5{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlGn.q3-5{fill:#a6d96a;stroke:#a6d96a;background:#a6d96a}.RdYlGn.q4-5{fill:#1a9641;stroke:#1a9641;background:#1a9641}.RdYlGn.q0-6{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlGn.q1-6{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.RdYlGn.q2-6{fill:#fee08b;stroke:#fee08b;background:#fee08b}.RdYlGn.q3-6{fill:#d9ef8b;stroke:#d9ef8b;background:#d9ef8b}.RdYlGn.q4-6{fill:#91cf60;stroke:#91cf60;background:#91cf60}.RdYlGn.q5-6{fill:#1a9850;stroke:#1a9850;background:#1a9850}.RdYlGn.q0-7{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlGn.q1-7{fill:#fc8d59;stroke:#fc8d59;background:#fc8d59}.RdYlGn.q2-7{fill:#fee08b;stroke:#fee08b;background:#fee08b}.RdYlGn.q3-7{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlGn.q4-7{fill:#d9ef8b;stroke:#d9ef8b;background:#d9ef8b}.RdYlGn.q5-7{fill:#91cf60;stroke:#91cf60;background:#91cf60}.RdYlGn.q6-7{fill:#1a9850;stroke:#1a9850;background:#1a9850}.RdYlGn.q0-8{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlGn.q1-8{fill:#f46d43;stroke:#f46d43;background:#f46d43}.RdYlGn.q2-8{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlGn.q3-8{fill:#fee08b;stroke:#fee08b;background:#fee08b}.RdYlGn.q4-8{fill:#d9ef8b;stroke:#d9ef8b;background:#d9ef8b}.RdYlGn.q5-8{fill:#a6d96a;stroke:#a6d96a;background:#a6d96a}.RdYlGn.q6-8{fill:#66bd63;stroke:#66bd63;background:#66bd63}.RdYlGn.q7-8{fill:#1a9850;stroke:#1a9850;background:#1a9850}.RdYlGn.q0-9{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlGn.q1-9{fill:#f46d43;stroke:#f46d43;background:#f46d43}.RdYlGn.q2-9{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlGn.q3-9{fill:#fee08b;stroke:#fee08b;background:#fee08b}.RdYlGn.q4-9{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlGn.q5-9{fill:#d9ef8b;stroke:#d9ef8b;background:#d9ef8b}.RdYlGn.q6-9{fill:#a6d96a;stroke:#a6d96a;background:#a6d96a}.RdYlGn.q7-9{fill:#66bd63;stroke:#66bd63;background:#66bd63}.RdYlGn.q8-9{fill:#1a9850;stroke:#1a9850;background:#1a9850}.RdYlGn.q0-10{fill:#a50026;stroke:#a50026;background:#a50026}.RdYlGn.q1-10{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlGn.q2-10{fill:#f46d43;stroke:#f46d43;background:#f46d43}.RdYlGn.q3-10{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlGn.q4-10{fill:#fee08b;stroke:#fee08b;background:#fee08b}.RdYlGn.q5-10{fill:#d9ef8b;stroke:#d9ef8b;background:#d9ef8b}.RdYlGn.q6-10{fill:#a6d96a;stroke:#a6d96a;background:#a6d96a}.RdYlGn.q7-10{fill:#66bd63;stroke:#66bd63;background:#66bd63}.RdYlGn.q8-10{fill:#1a9850;stroke:#1a9850;background:#1a9850}.RdYlGn.q9-10{fill:#006837;stroke:#006837;background:#006837}.RdYlGn.q0-11{fill:#a50026;stroke:#a50026;background:#a50026}.RdYlGn.q1-11{fill:#d73027;stroke:#d73027;background:#d73027}.RdYlGn.q2-11{fill:#f46d43;stroke:#f46d43;background:#f46d43}.RdYlGn.q3-11{fill:#fdae61;stroke:#fdae61;background:#fdae61}.RdYlGn.q4-11{fill:#fee08b;stroke:#fee08b;background:#fee08b}.RdYlGn.q5-11{fill:#ffffbf;stroke:#ffffbf;background:#ffffbf}.RdYlGn.q6-11{fill:#d9ef8b;stroke:#d9ef8b;background:#d9ef8b}.RdYlGn.q7-11{fill:#a6d96a;stroke:#a6d96a;background:#a6d96a}.RdYlGn.q8-11{fill:#66bd63;stroke:#66bd63;background:#66bd63}.RdYlGn.q9-11{fill:#1a9850;stroke:#1a9850;background:#1a9850}.RdYlGn.q10-11{fill:#006837;stroke:#006837;background:#006837}.Accent.q0-3{fill:#7fc97f;stroke:#7fc97f;background:#7fc97f}.Accent.q1-3{fill:#beaed4;stroke:#beaed4;background:#beaed4}.Accent.q2-3{fill:#fdc086;stroke:#fdc086;background:#fdc086}.Accent.q0-4{fill:#7fc97f;stroke:#7fc97f;background:#7fc97f}.Accent.q1-4{fill:#beaed4;stroke:#beaed4;background:#beaed4}.Accent.q2-4{fill:#fdc086;stroke:#fdc086;background:#fdc086}.Accent.q3-4{fill:#ff9;stroke:#ff9;background:#ff9}.Accent.q0-5{fill:#7fc97f;stroke:#7fc97f;background:#7fc97f}.Accent.q1-5{fill:#beaed4;stroke:#beaed4;background:#beaed4}.Accent.q2-5{fill:#fdc086;stroke:#fdc086;background:#fdc086}.Accent.q3-5{fill:#ff9;stroke:#ff9;background:#ff9}.Accent.q4-5{fill:#386cb0;stroke:#386cb0;background:#386cb0}.Accent.q0-6{fill:#7fc97f;stroke:#7fc97f;background:#7fc97f}.Accent.q1-6{fill:#beaed4;stroke:#beaed4;background:#beaed4}.Accent.q2-6{fill:#fdc086;stroke:#fdc086;background:#fdc086}.Accent.q3-6{fill:#ff9;stroke:#ff9;background:#ff9}.Accent.q4-6{fill:#386cb0;stroke:#386cb0;background:#386cb0}.Accent.q5-6{fill:#f0027f;stroke:#f0027f;background:#f0027f}.Accent.q0-7{fill:#7fc97f;stroke:#7fc97f;background:#7fc97f}.Accent.q1-7{fill:#beaed4;stroke:#beaed4;background:#beaed4}.Accent.q2-7{fill:#fdc086;stroke:#fdc086;background:#fdc086}.Accent.q3-7{fill:#ff9;stroke:#ff9;background:#ff9}.Accent.q4-7{fill:#386cb0;stroke:#386cb0;background:#386cb0}.Accent.q5-7{fill:#f0027f;stroke:#f0027f;background:#f0027f}.Accent.q6-7{fill:#bf5b17;stroke:#bf5b17;background:#bf5b17}.Accent.q0-8{fill:#7fc97f;stroke:#7fc97f;background:#7fc97f}.Accent.q1-8{fill:#beaed4;stroke:#beaed4;background:#beaed4}.Accent.q2-8{fill:#fdc086;stroke:#fdc086;background:#fdc086}.Accent.q3-8{fill:#ff9;stroke:#ff9;background:#ff9}.Accent.q4-8{fill:#386cb0;stroke:#386cb0;background:#386cb0}.Accent.q5-8{fill:#f0027f;stroke:#f0027f;background:#f0027f}.Accent.q6-8{fill:#bf5b17;stroke:#bf5b17;background:#bf5b17}.Accent.q7-8{fill:#666;stroke:#666;background:#666}.Dark2.q0-3{fill:#1b9e77;stroke:#1b9e77;background:#1b9e77}.Dark2.q1-3{fill:#d95f02;stroke:#d95f02;background:#d95f02}.Dark2.q2-3{fill:#7570b3;stroke:#7570b3;background:#7570b3}.Dark2.q0-4{fill:#1b9e77;stroke:#1b9e77;background:#1b9e77}.Dark2.q1-4{fill:#d95f02;stroke:#d95f02;background:#d95f02}.Dark2.q2-4{fill:#7570b3;stroke:#7570b3;background:#7570b3}.Dark2.q3-4{fill:#e7298a;stroke:#e7298a;background:#e7298a}.Dark2.q0-5{fill:#1b9e77;stroke:#1b9e77;background:#1b9e77}.Dark2.q1-5{fill:#d95f02;stroke:#d95f02;background:#d95f02}.Dark2.q2-5{fill:#7570b3;stroke:#7570b3;background:#7570b3}.Dark2.q3-5{fill:#e7298a;stroke:#e7298a;background:#e7298a}.Dark2.q4-5{fill:#66a61e;stroke:#66a61e;background:#66a61e}.Dark2.q0-6{fill:#1b9e77;stroke:#1b9e77;background:#1b9e77}.Dark2.q1-6{fill:#d95f02;stroke:#d95f02;background:#d95f02}.Dark2.q2-6{fill:#7570b3;stroke:#7570b3;background:#7570b3}.Dark2.q3-6{fill:#e7298a;stroke:#e7298a;background:#e7298a}.Dark2.q4-6{fill:#66a61e;stroke:#66a61e;background:#66a61e}.Dark2.q5-6{fill:#e6ab02;stroke:#e6ab02;background:#e6ab02}.Dark2.q0-7{fill:#1b9e77;stroke:#1b9e77;background:#1b9e77}.Dark2.q1-7{fill:#d95f02;stroke:#d95f02;background:#d95f02}.Dark2.q2-7{fill:#7570b3;stroke:#7570b3;background:#7570b3}.Dark2.q3-7{fill:#e7298a;stroke:#e7298a;background:#e7298a}.Dark2.q4-7{fill:#66a61e;stroke:#66a61e;background:#66a61e}.Dark2.q5-7{fill:#e6ab02;stroke:#e6ab02;background:#e6ab02}.Dark2.q6-7{fill:#a6761d;stroke:#a6761d;background:#a6761d}.Dark2.q0-8{fill:#1b9e77;stroke:#1b9e77;background:#1b9e77}.Dark2.q1-8{fill:#d95f02;stroke:#d95f02;background:#d95f02}.Dark2.q2-8{fill:#7570b3;stroke:#7570b3;background:#7570b3}.Dark2.q3-8{fill:#e7298a;stroke:#e7298a;background:#e7298a}.Dark2.q4-8{fill:#66a61e;stroke:#66a61e;background:#66a61e}.Dark2.q5-8{fill:#e6ab02;stroke:#e6ab02;background:#e6ab02}.Dark2.q6-8{fill:#a6761d;stroke:#a6761d;background:#a6761d}.Dark2.q7-8{fill:#666;stroke:#666;background:#666}.Paired.q0-3{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-3{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-3{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q0-4{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-4{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-4{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-4{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q0-5{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-5{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-5{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-5{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q4-5{fill:#fb9a99;stroke:#fb9a99;background:#fb9a99}.Paired.q0-6{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-6{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-6{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-6{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q4-6{fill:#fb9a99;stroke:#fb9a99;background:#fb9a99}.Paired.q5-6{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.Paired.q0-7{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-7{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-7{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-7{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q4-7{fill:#fb9a99;stroke:#fb9a99;background:#fb9a99}.Paired.q5-7{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.Paired.q6-7{fill:#fdbf6f;stroke:#fdbf6f;background:#fdbf6f}.Paired.q0-8{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-8{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-8{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-8{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q4-8{fill:#fb9a99;stroke:#fb9a99;background:#fb9a99}.Paired.q5-8{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.Paired.q6-8{fill:#fdbf6f;stroke:#fdbf6f;background:#fdbf6f}.Paired.q7-8{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Paired.q0-9{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-9{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-9{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-9{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q4-9{fill:#fb9a99;stroke:#fb9a99;background:#fb9a99}.Paired.q5-9{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.Paired.q6-9{fill:#fdbf6f;stroke:#fdbf6f;background:#fdbf6f}.Paired.q7-9{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Paired.q8-9{fill:#cab2d6;stroke:#cab2d6;background:#cab2d6}.Paired.q0-10{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-10{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-10{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-10{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q4-10{fill:#fb9a99;stroke:#fb9a99;background:#fb9a99}.Paired.q5-10{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.Paired.q6-10{fill:#fdbf6f;stroke:#fdbf6f;background:#fdbf6f}.Paired.q7-10{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Paired.q8-10{fill:#cab2d6;stroke:#cab2d6;background:#cab2d6}.Paired.q9-10{fill:#6a3d9a;stroke:#6a3d9a;background:#6a3d9a}.Paired.q0-11{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-11{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-11{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-11{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q4-11{fill:#fb9a99;stroke:#fb9a99;background:#fb9a99}.Paired.q5-11{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.Paired.q6-11{fill:#fdbf6f;stroke:#fdbf6f;background:#fdbf6f}.Paired.q7-11{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Paired.q8-11{fill:#cab2d6;stroke:#cab2d6;background:#cab2d6}.Paired.q9-11{fill:#6a3d9a;stroke:#6a3d9a;background:#6a3d9a}.Paired.q10-11{fill:#ff9;stroke:#ff9;background:#ff9}.Paired.q0-12{fill:#a6cee3;stroke:#a6cee3;background:#a6cee3}.Paired.q1-12{fill:#1f78b4;stroke:#1f78b4;background:#1f78b4}.Paired.q2-12{fill:#b2df8a;stroke:#b2df8a;background:#b2df8a}.Paired.q3-12{fill:#33a02c;stroke:#33a02c;background:#33a02c}.Paired.q4-12{fill:#fb9a99;stroke:#fb9a99;background:#fb9a99}.Paired.q5-12{fill:#e31a1c;stroke:#e31a1c;background:#e31a1c}.Paired.q6-12{fill:#fdbf6f;stroke:#fdbf6f;background:#fdbf6f}.Paired.q7-12{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Paired.q8-12{fill:#cab2d6;stroke:#cab2d6;background:#cab2d6}.Paired.q9-12{fill:#6a3d9a;stroke:#6a3d9a;background:#6a3d9a}.Paired.q10-12{fill:#ff9;stroke:#ff9;background:#ff9}.Paired.q11-12{fill:#b15928;stroke:#b15928;background:#b15928}.Pastel1.q0-3{fill:#fbb4ae;stroke:#fbb4ae;background:#fbb4ae}.Pastel1.q1-3{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.Pastel1.q2-3{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Pastel1.q0-4{fill:#fbb4ae;stroke:#fbb4ae;background:#fbb4ae}.Pastel1.q1-4{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.Pastel1.q2-4{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Pastel1.q3-4{fill:#decbe4;stroke:#decbe4;background:#decbe4}.Pastel1.q0-5{fill:#fbb4ae;stroke:#fbb4ae;background:#fbb4ae}.Pastel1.q1-5{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.Pastel1.q2-5{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Pastel1.q3-5{fill:#decbe4;stroke:#decbe4;background:#decbe4}.Pastel1.q4-5{fill:#fed9a6;stroke:#fed9a6;background:#fed9a6}.Pastel1.q0-6{fill:#fbb4ae;stroke:#fbb4ae;background:#fbb4ae}.Pastel1.q1-6{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.Pastel1.q2-6{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Pastel1.q3-6{fill:#decbe4;stroke:#decbe4;background:#decbe4}.Pastel1.q4-6{fill:#fed9a6;stroke:#fed9a6;background:#fed9a6}.Pastel1.q5-6{fill:#ffc;stroke:#ffc;background:#ffc}.Pastel1.q0-7{fill:#fbb4ae;stroke:#fbb4ae;background:#fbb4ae}.Pastel1.q1-7{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.Pastel1.q2-7{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Pastel1.q3-7{fill:#decbe4;stroke:#decbe4;background:#decbe4}.Pastel1.q4-7{fill:#fed9a6;stroke:#fed9a6;background:#fed9a6}.Pastel1.q5-7{fill:#ffc;stroke:#ffc;background:#ffc}.Pastel1.q6-7{fill:#e5d8bd;stroke:#e5d8bd;background:#e5d8bd}.Pastel1.q0-8{fill:#fbb4ae;stroke:#fbb4ae;background:#fbb4ae}.Pastel1.q1-8{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.Pastel1.q2-8{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Pastel1.q3-8{fill:#decbe4;stroke:#decbe4;background:#decbe4}.Pastel1.q4-8{fill:#fed9a6;stroke:#fed9a6;background:#fed9a6}.Pastel1.q5-8{fill:#ffc;stroke:#ffc;background:#ffc}.Pastel1.q6-8{fill:#e5d8bd;stroke:#e5d8bd;background:#e5d8bd}.Pastel1.q7-8{fill:#fddaec;stroke:#fddaec;background:#fddaec}.Pastel1.q0-9{fill:#fbb4ae;stroke:#fbb4ae;background:#fbb4ae}.Pastel1.q1-9{fill:#b3cde3;stroke:#b3cde3;background:#b3cde3}.Pastel1.q2-9{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Pastel1.q3-9{fill:#decbe4;stroke:#decbe4;background:#decbe4}.Pastel1.q4-9{fill:#fed9a6;stroke:#fed9a6;background:#fed9a6}.Pastel1.q5-9{fill:#ffc;stroke:#ffc;background:#ffc}.Pastel1.q6-9{fill:#e5d8bd;stroke:#e5d8bd;background:#e5d8bd}.Pastel1.q7-9{fill:#fddaec;stroke:#fddaec;background:#fddaec}.Pastel1.q8-9{fill:#f2f2f2;stroke:#f2f2f2;background:#f2f2f2}.Pastel2.q0-3{fill:#b3e2cd;stroke:#b3e2cd;background:#b3e2cd}.Pastel2.q1-3{fill:#fdcdac;stroke:#fdcdac;background:#fdcdac}.Pastel2.q2-3{fill:#cbd5e8;stroke:#cbd5e8;background:#cbd5e8}.Pastel2.q0-4{fill:#b3e2cd;stroke:#b3e2cd;background:#b3e2cd}.Pastel2.q1-4{fill:#fdcdac;stroke:#fdcdac;background:#fdcdac}.Pastel2.q2-4{fill:#cbd5e8;stroke:#cbd5e8;background:#cbd5e8}.Pastel2.q3-4{fill:#f4cae4;stroke:#f4cae4;background:#f4cae4}.Pastel2.q0-5{fill:#b3e2cd;stroke:#b3e2cd;background:#b3e2cd}.Pastel2.q1-5{fill:#fdcdac;stroke:#fdcdac;background:#fdcdac}.Pastel2.q2-5{fill:#cbd5e8;stroke:#cbd5e8;background:#cbd5e8}.Pastel2.q3-5{fill:#f4cae4;stroke:#f4cae4;background:#f4cae4}.Pastel2.q4-5{fill:#e6f5c9;stroke:#e6f5c9;background:#e6f5c9}.Pastel2.q0-6{fill:#b3e2cd;stroke:#b3e2cd;background:#b3e2cd}.Pastel2.q1-6{fill:#fdcdac;stroke:#fdcdac;background:#fdcdac}.Pastel2.q2-6{fill:#cbd5e8;stroke:#cbd5e8;background:#cbd5e8}.Pastel2.q3-6{fill:#f4cae4;stroke:#f4cae4;background:#f4cae4}.Pastel2.q4-6{fill:#e6f5c9;stroke:#e6f5c9;background:#e6f5c9}.Pastel2.q5-6{fill:#fff2ae;stroke:#fff2ae;background:#fff2ae}.Pastel2.q0-7{fill:#b3e2cd;stroke:#b3e2cd;background:#b3e2cd}.Pastel2.q1-7{fill:#fdcdac;stroke:#fdcdac;background:#fdcdac}.Pastel2.q2-7{fill:#cbd5e8;stroke:#cbd5e8;background:#cbd5e8}.Pastel2.q3-7{fill:#f4cae4;stroke:#f4cae4;background:#f4cae4}.Pastel2.q4-7{fill:#e6f5c9;stroke:#e6f5c9;background:#e6f5c9}.Pastel2.q5-7{fill:#fff2ae;stroke:#fff2ae;background:#fff2ae}.Pastel2.q6-7{fill:#f1e2cc;stroke:#f1e2cc;background:#f1e2cc}.Pastel2.q0-8{fill:#b3e2cd;stroke:#b3e2cd;background:#b3e2cd}.Pastel2.q1-8{fill:#fdcdac;stroke:#fdcdac;background:#fdcdac}.Pastel2.q2-8{fill:#cbd5e8;stroke:#cbd5e8;background:#cbd5e8}.Pastel2.q3-8{fill:#f4cae4;stroke:#f4cae4;background:#f4cae4}.Pastel2.q4-8{fill:#e6f5c9;stroke:#e6f5c9;background:#e6f5c9}.Pastel2.q5-8{fill:#fff2ae;stroke:#fff2ae;background:#fff2ae}.Pastel2.q6-8{fill:#f1e2cc;stroke:#f1e2cc;background:#f1e2cc}.Pastel2.q7-8{fill:#ccc;stroke:#ccc;background:#ccc}.Set1.q0-3{fill:#e41a1c;stroke:#e41a1c;background:#e41a1c}.Set1.q1-3{fill:#377eb8;stroke:#377eb8;background:#377eb8}.Set1.q2-3{fill:#4daf4a;stroke:#4daf4a;background:#4daf4a}.Set1.q0-4{fill:#e41a1c;stroke:#e41a1c;background:#e41a1c}.Set1.q1-4{fill:#377eb8;stroke:#377eb8;background:#377eb8}.Set1.q2-4{fill:#4daf4a;stroke:#4daf4a;background:#4daf4a}.Set1.q3-4{fill:#984ea3;stroke:#984ea3;background:#984ea3}.Set1.q0-5{fill:#e41a1c;stroke:#e41a1c;background:#e41a1c}.Set1.q1-5{fill:#377eb8;stroke:#377eb8;background:#377eb8}.Set1.q2-5{fill:#4daf4a;stroke:#4daf4a;background:#4daf4a}.Set1.q3-5{fill:#984ea3;stroke:#984ea3;background:#984ea3}.Set1.q4-5{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Set1.q0-6{fill:#e41a1c;stroke:#e41a1c;background:#e41a1c}.Set1.q1-6{fill:#377eb8;stroke:#377eb8;background:#377eb8}.Set1.q2-6{fill:#4daf4a;stroke:#4daf4a;background:#4daf4a}.Set1.q3-6{fill:#984ea3;stroke:#984ea3;background:#984ea3}.Set1.q4-6{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Set1.q5-6{fill:#ff3;stroke:#ff3;background:#ff3}.Set1.q0-7{fill:#e41a1c;stroke:#e41a1c;background:#e41a1c}.Set1.q1-7{fill:#377eb8;stroke:#377eb8;background:#377eb8}.Set1.q2-7{fill:#4daf4a;stroke:#4daf4a;background:#4daf4a}.Set1.q3-7{fill:#984ea3;stroke:#984ea3;background:#984ea3}.Set1.q4-7{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Set1.q5-7{fill:#ff3;stroke:#ff3;background:#ff3}.Set1.q6-7{fill:#a65628;stroke:#a65628;background:#a65628}.Set1.q0-8{fill:#e41a1c;stroke:#e41a1c;background:#e41a1c}.Set1.q1-8{fill:#377eb8;stroke:#377eb8;background:#377eb8}.Set1.q2-8{fill:#4daf4a;stroke:#4daf4a;background:#4daf4a}.Set1.q3-8{fill:#984ea3;stroke:#984ea3;background:#984ea3}.Set1.q4-8{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Set1.q5-8{fill:#ff3;stroke:#ff3;background:#ff3}.Set1.q6-8{fill:#a65628;stroke:#a65628;background:#a65628}.Set1.q7-8{fill:#f781bf;stroke:#f781bf;background:#f781bf}.Set1.q0-9{fill:#e41a1c;stroke:#e41a1c;background:#e41a1c}.Set1.q1-9{fill:#377eb8;stroke:#377eb8;background:#377eb8}.Set1.q2-9{fill:#4daf4a;stroke:#4daf4a;background:#4daf4a}.Set1.q3-9{fill:#984ea3;stroke:#984ea3;background:#984ea3}.Set1.q4-9{fill:#ff7f00;stroke:#ff7f00;background:#ff7f00}.Set1.q5-9{fill:#ff3;stroke:#ff3;background:#ff3}.Set1.q6-9{fill:#a65628;stroke:#a65628;background:#a65628}.Set1.q7-9{fill:#f781bf;stroke:#f781bf;background:#f781bf}.Set1.q8-9{fill:#999;stroke:#999;background:#999}.Set2.q0-3{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Set2.q1-3{fill:#fc8d62;stroke:#fc8d62;background:#fc8d62}.Set2.q2-3{fill:#8da0cb;stroke:#8da0cb;background:#8da0cb}.Set2.q0-4{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Set2.q1-4{fill:#fc8d62;stroke:#fc8d62;background:#fc8d62}.Set2.q2-4{fill:#8da0cb;stroke:#8da0cb;background:#8da0cb}.Set2.q3-4{fill:#e78ac3;stroke:#e78ac3;background:#e78ac3}.Set2.q0-5{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Set2.q1-5{fill:#fc8d62;stroke:#fc8d62;background:#fc8d62}.Set2.q2-5{fill:#8da0cb;stroke:#8da0cb;background:#8da0cb}.Set2.q3-5{fill:#e78ac3;stroke:#e78ac3;background:#e78ac3}.Set2.q4-5{fill:#a6d854;stroke:#a6d854;background:#a6d854}.Set2.q0-6{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Set2.q1-6{fill:#fc8d62;stroke:#fc8d62;background:#fc8d62}.Set2.q2-6{fill:#8da0cb;stroke:#8da0cb;background:#8da0cb}.Set2.q3-6{fill:#e78ac3;stroke:#e78ac3;background:#e78ac3}.Set2.q4-6{fill:#a6d854;stroke:#a6d854;background:#a6d854}.Set2.q5-6{fill:#ffd92f;stroke:#ffd92f;background:#ffd92f}.Set2.q0-7{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Set2.q1-7{fill:#fc8d62;stroke:#fc8d62;background:#fc8d62}.Set2.q2-7{fill:#8da0cb;stroke:#8da0cb;background:#8da0cb}.Set2.q3-7{fill:#e78ac3;stroke:#e78ac3;background:#e78ac3}.Set2.q4-7{fill:#a6d854;stroke:#a6d854;background:#a6d854}.Set2.q5-7{fill:#ffd92f;stroke:#ffd92f;background:#ffd92f}.Set2.q6-7{fill:#e5c494;stroke:#e5c494;background:#e5c494}.Set2.q0-8{fill:#66c2a5;stroke:#66c2a5;background:#66c2a5}.Set2.q1-8{fill:#fc8d62;stroke:#fc8d62;background:#fc8d62}.Set2.q2-8{fill:#8da0cb;stroke:#8da0cb;background:#8da0cb}.Set2.q3-8{fill:#e78ac3;stroke:#e78ac3;background:#e78ac3}.Set2.q4-8{fill:#a6d854;stroke:#a6d854;background:#a6d854}.Set2.q5-8{fill:#ffd92f;stroke:#ffd92f;background:#ffd92f}.Set2.q6-8{fill:#e5c494;stroke:#e5c494;background:#e5c494}.Set2.q7-8{fill:#b3b3b3;stroke:#b3b3b3;background:#b3b3b3}.Set3.q0-3{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-3{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-3{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q0-4{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-4{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-4{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-4{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q0-5{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-5{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-5{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-5{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q4-5{fill:#80b1d3;stroke:#80b1d3;background:#80b1d3}.Set3.q0-6{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-6{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-6{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-6{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q4-6{fill:#80b1d3;stroke:#80b1d3;background:#80b1d3}.Set3.q5-6{fill:#fdb462;stroke:#fdb462;background:#fdb462}.Set3.q0-7{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-7{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-7{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-7{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q4-7{fill:#80b1d3;stroke:#80b1d3;background:#80b1d3}.Set3.q5-7{fill:#fdb462;stroke:#fdb462;background:#fdb462}.Set3.q6-7{fill:#b3de69;stroke:#b3de69;background:#b3de69}.Set3.q0-8{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-8{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-8{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-8{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q4-8{fill:#80b1d3;stroke:#80b1d3;background:#80b1d3}.Set3.q5-8{fill:#fdb462;stroke:#fdb462;background:#fdb462}.Set3.q6-8{fill:#b3de69;stroke:#b3de69;background:#b3de69}.Set3.q7-8{fill:#fccde5;stroke:#fccde5;background:#fccde5}.Set3.q0-9{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-9{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-9{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-9{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q4-9{fill:#80b1d3;stroke:#80b1d3;background:#80b1d3}.Set3.q5-9{fill:#fdb462;stroke:#fdb462;background:#fdb462}.Set3.q6-9{fill:#b3de69;stroke:#b3de69;background:#b3de69}.Set3.q7-9{fill:#fccde5;stroke:#fccde5;background:#fccde5}.Set3.q8-9{fill:#d9d9d9;stroke:#d9d9d9;background:#d9d9d9}.Set3.q0-10{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-10{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-10{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-10{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q4-10{fill:#80b1d3;stroke:#80b1d3;background:#80b1d3}.Set3.q5-10{fill:#fdb462;stroke:#fdb462;background:#fdb462}.Set3.q6-10{fill:#b3de69;stroke:#b3de69;background:#b3de69}.Set3.q7-10{fill:#fccde5;stroke:#fccde5;background:#fccde5}.Set3.q8-10{fill:#d9d9d9;stroke:#d9d9d9;background:#d9d9d9}.Set3.q9-10{fill:#bc80bd;stroke:#bc80bd;background:#bc80bd}.Set3.q0-11{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-11{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-11{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-11{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q4-11{fill:#80b1d3;stroke:#80b1d3;background:#80b1d3}.Set3.q5-11{fill:#fdb462;stroke:#fdb462;background:#fdb462}.Set3.q6-11{fill:#b3de69;stroke:#b3de69;background:#b3de69}.Set3.q7-11{fill:#fccde5;stroke:#fccde5;background:#fccde5}.Set3.q8-11{fill:#d9d9d9;stroke:#d9d9d9;background:#d9d9d9}.Set3.q9-11{fill:#bc80bd;stroke:#bc80bd;background:#bc80bd}.Set3.q10-11{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Set3.q0-12{fill:#8dd3c7;stroke:#8dd3c7;background:#8dd3c7}.Set3.q1-12{fill:#ffffb3;stroke:#ffffb3;background:#ffffb3}.Set3.q2-12{fill:#bebada;stroke:#bebada;background:#bebada}.Set3.q3-12{fill:#fb8072;stroke:#fb8072;background:#fb8072}.Set3.q4-12{fill:#80b1d3;stroke:#80b1d3;background:#80b1d3}.Set3.q5-12{fill:#fdb462;stroke:#fdb462;background:#fdb462}.Set3.q6-12{fill:#b3de69;stroke:#b3de69;background:#b3de69}.Set3.q7-12{fill:#fccde5;stroke:#fccde5;background:#fccde5}.Set3.q8-12{fill:#d9d9d9;stroke:#d9d9d9;background:#d9d9d9}.Set3.q9-12{fill:#bc80bd;stroke:#bc80bd;background:#bc80bd}.Set3.q10-12{fill:#ccebc5;stroke:#ccebc5;background:#ccebc5}.Set3.q11-12{fill:#ffed6f;stroke:#ffed6f;background:#ffed6f}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-ordinal{syntax:\"*\";inherits:false}@property --tw-slashed-zero{syntax:\"*\";inherits:false}@property --tw-numeric-figure{syntax:\"*\";inherits:false}@property --tw-numeric-spacing{syntax:\"*\";inherits:false}@property --tw-numeric-fraction{syntax:\"*\";inherits:false}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}";

const KortxyzTauchart = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    get chartEl() { return getElement(this); }
    chart;
    /** Fetch data from a url */
    data;
    /** Fetch data from a store */
    store;
    /** Type of chart */
    type;
    /** Attribute to use on the y axis */
    y;
    /** Attribute to use on the x axis */
    x;
    /** Attribute to use for color */
    color;
    /** Colorscheme based on Colorbrewer2 */
    colorbrewer;
    /** Group data by these keys returning a attribute called "count"  */
    groupByKeys;
    /** Show tooltips on hover */
    tooltip = false;
    /** Add a legend */
    legend = false;
    fetchfromStore = async () => {
        let datastore;
        while ((datastore = getStore(this.store)) == undefined || !datastore.get("data").features.length)
            await new Promise(r => setTimeout(r, 200));
        return datastore.get("data");
    };
    fetchfromURL = async (url) => {
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`An error has occured: ${res.status}`);
        return await res.json();
    };
    refactorData = (geojson) => {
        let dataset = geojson.features.map(e => ({ ...e.properties }));
        const groupByKeys = this.groupByKeys?.split(",");
        if (groupByKeys) {
            dataset = Object.values(dataset.reduce((acc, e) => (key => (acc[key] ??= { ...Object.fromEntries(groupByKeys.map(k => [k, e[k]])), count: 0 },
                acc[key].count++,
                acc))(groupByKeys.map(k => e[k]).join('|')), {}));
        }
        return dataset;
    };
    getColorBrewer = (dataset, color) => {
        const uniqueValues = new Set(dataset.map(e => e[color]));
        const numberofcolors = Math.min(12, Math.max(3, uniqueValues.size));
        const colorbrewer = tauBrewer(this.colorbrewer, numberofcolors);
        return {
            color: {
                brewer: colorbrewer
            }
        };
    };
    async componentDidLoad() {
        let geojson;
        if (this.data)
            geojson = await this.fetchfromURL(this.data);
        else if (this.store)
            geojson = await this.fetchfromStore();
        const dataset = this.refactorData(geojson);
        let plugins = [];
        if (this.tooltip)
            plugins.push(Taucharts.api.plugins.get('tooltip')());
        if (this.legend)
            plugins.push(Taucharts.api.plugins.get('legend')());
        let chartSpec = {
            data: dataset,
            type: this.type,
            y: this.y,
            x: this.x,
            color: this.color,
            plugins,
            settings: {
                asyncRendering: true,
                renderingTimeout: 500,
            }
        };
        if (this.colorbrewer)
            chartSpec["guide"] = this.getColorBrewer(dataset, this.color);
        this.chart = new Taucharts.Chart(chartSpec);
        this.chart.renderTo(this.chartEl);
        this.chart.refresh();
    }
};
KortxyzTauchart.style = kortxyzTauchartCss + tauchartsMinCss;

export { KortxyzTauchart as kortxyz_tauchart };
//# sourceMappingURL=kortxyz-tauchart.entry.esm.js.map
