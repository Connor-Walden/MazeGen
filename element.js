class Slider {
    constructor(name, min, max, value, useLabel) {
        this.name = name;
        this.min = min;
        this.max = max;
        this.value = value;
        this.prevValue = this.value;
        this.useLabel = useLabel;

        this.init();
    }

    init() {
        this.element = document.createElement('input');

        this.element.type = 'range';
        this.element.min = this.min;
        this.element.max = this.max;
        this.element.value = this.value;
        this.element.className = 'slider';
        this.element.id = this.name;

        if(this.useLabel) {
            this.label = document.createElement('label');
            this.label.innerHTML = this.name + ':';
            this.label.htmlFor = this.name;
        }
    }

    tick() {
        if(this.useLabel && this.prevValue !== this.element.value) {
            this.label.innerHTML = this.name + ': ' + this.element.value + '%';
            this.prevValue = this.element.value;
        }

        this.value = this.element.value;
    }

    use(element) {
        if(this.useLabel) element.element.appendChild(this.label);
        element.element.appendChild(this.element);
        element.element.appendChild(document.createElement('br'));
    }
}

class Input {
    constructor(name, value, useLabel) {
        this.name = name;
        this.value = value;
        this.useLabel = useLabel;

        this.init();
    }

    init() {
        this.element = document.createElement('input');

        this.element.type = 'text';
        this.element.value = this.value;
        this.element.id = this.name;

        if(this.useLabel) {
            this.label = document.createElement('label');
            this.label.innerHTML = this.name + ':';
            this.label.htmlFor = this.name;
        }
    }

    tick() {
        this.value = this.element.value;
    }

    use(element) {
        if(this.useLabel) element.element.appendChild(this.label);
        element.element.appendChild(this.element);
        element.element.appendChild(document.createElement('br'));
    }
}

class Button {
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;

        this.init();
    }

    init() {
        this.element = document.createElement('button');

        this.element.innerHTML = this.name;
        this.element.id = this.name;

        this.element.onclick = this.callback;
    }

    use(element) {
        element.element.appendChild(this.element);
        element.element.appendChild(document.createElement('br'));
    }
}

class Section {
    constructor(name, parent, style = null) {
        this.name = name;
        this.parent = document.querySelector(parent);
        this.style = style === null ? '' : style;

        this.init();
    }

    init() {
        this.element = document.createElement('div');

        this.element.id = this.name;
        this.element.style = this.style;

        this.parent.appendChild(this.element);
    }

    append(child) {
        this.element.appendChild(child.element);
    }
}

class Heading {
    constructor(name, style = null) {
        this.name = name;
        this.style = style === null ? '' : style;

        this.init();
    }

    init() {
        this.element = document.createElement('h1');

        this.element.id = this.name;
        this.element.innerHTML = this.name;
        this.element.style = this.style;
    }

    use(element) {
        element.element.appendChild(this.element);
    }
}

class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.init();
    }

    init() {
        this.element = document.createElement('canvas');
        this.size(this.width, this.height);

        this.context = this.element.getContext('2d');
    }

    use(element) {
        element.element.appendChild(this.canvas);
    }

    clear(style) {
        this.context.fillStyle = style;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    fill(x, y, w, h, style) {
        this.context.fillStyle = style;
        this.context.fillRect(x, y, w, h);
    }

    size(w, h) {
        this.element.width = this.width = w;
        this.element.height = this.height = h;
    }

    line(style, sx, sy, dx, dy) {
        this.context.beginPath();
        this.context.moveTo(sx, sy);
        this.context.lineTo(dx, dy);
        this.context.strokeStyle = style;
        this.context.stroke();
    }
}