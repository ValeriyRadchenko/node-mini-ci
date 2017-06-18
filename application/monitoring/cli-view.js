const charm = require('charm')();

class CLIView {

    constructor(header, colWidth) {
        this.model = {
            header: header,
            body: {}
        };

        charm.pipe(process.stdout);
        this.savedPositions = [];
        this.colWidth = colWidth;
        this.init();

        process.on('exit', () => {
            this.reset();
            charm.cursor(true);
        });
    }

    push(osProcessUsage) {
        osProcessUsage = this.normalizeData(osProcessUsage);

        if (this.model.body[osProcessUsage.pid.value]) {
            this.updateProcess(osProcessUsage);
            return;
        }

        this.model.body[osProcessUsage.pid.value] = osProcessUsage;
        this.drawProcess(osProcessUsage);
    }

    remove(pid) {
        delete this.model.body[pid];
        this.init();

        for (let key in this.model.body) {
            let item = this.model.body[key];
            this.drawProcess(item);
        }
    }

    init() {
        this.reset();
        this.cursorPosition = {x: 0, y: 1};
        this.drawHeader(this.model.header);
        charm.cursor(false);
    }

    normalizeData(data) {
        let normalizedData = {};

        for (let i = 0; i < this.model.header.length; i++) {
            let headerItem = this.model.header[i];
            normalizedData[headerItem] = {value: data[i] + ''};
        }

        return normalizedData;
    }

    drawHeader(header) {
        charm.foreground(50);
        header.forEach(item => {
            this.write(item);
            this.right(this.colWidth - item.length);
        });

        this.down(1);
        this.left(this.cursorPosition.x);
        charm.foreground('white');
    }

    drawProcess(data) {

        for (let key in data) {
            let item = data[key];
            item.position = {x: this.cursorPosition.x, y: this.cursorPosition.y};
            this.write(item.value + '');
            this.right(this.colWidth - (item.value + '').length);
        }

        this.down(1);
        this.left(this.cursorPosition.x);
    }

    updateProcess(data) {
        this.positionPush();
        let oldItem = this.model.body[data.pid.value];
        this.position(0, oldItem.pid.position.y);
        charm.erase('line');

        for (let key in data) {
            let item = data[key];
            item.position = {x: this.cursorPosition.x, y: this.cursorPosition.y};
            this.write(item.value + '');
            this.right(this.colWidth - (item.value + '').length);
        }

        this.positionPop();
    }

    reset() {
        charm.reset();
        this.cursorPosition = {x: 0, y: 1};
    }

    down(y) {
        this.cursorPosition.y += y;
        charm.down(y);
    }

    up(y) {
        this.cursorPosition.y -= y;
        if (this.cursorPosition.y < 0) {
            this.cursorPosition.y = 0;
        }
        charm.up(y);
    }

    left(x) {
        this.cursorPosition.x -= x;
        if (this.cursorPosition.x < 0) {
            this.cursorPosition.x = 0;
        }
        charm.left(x);
    }

    right(x) {
        this.cursorPosition.x += x;
        charm.right(x);
    }

    write(msg) {
        this.cursorPosition.x += msg.length;
        charm.write(msg);
    }

    position(x, y) {
        this.cursorPosition.x = x;
        this.cursorPosition.y = y;
        charm.position(x, y);
    }

    positionPush() {
        this.savedPositions.push(Object.assign({}, this.cursorPosition));
    }

    positionPop() {
        this.cursorPosition = this.savedPositions.pop();
        this.position(this.cursorPosition.x, this.cursorPosition.y);
    }

}

module.exports = CLIView;