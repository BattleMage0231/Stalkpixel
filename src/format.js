// formatting related classes and constants

class Colors {
    static RED = '\033[91m';
    static GREEN = '\033[92m';
    static YELLOW = '\033[93m';
    static END = '\033[0m';

    static inColor(text, color) {
        return color + text + Colors.END;
    }
}

class Messages {
    // colored messages
    static NOT_ONLINE = Colors.inColor('Not Online', Colors.RED);
    static ONLINE = Colors.inColor('Online', Colors.GREEN);
    static WARNING_MSG = Colors.inColor(
        'This API function can be disabled in game, so some offline players may actually be online', 
        Colors.YELLOW
    );
    static FINISHED_MSG = Colors.inColor('Finished fetching statuses', Colors.YELLOW);
}

const PAD = '  ';

exports.Colors = Colors;
exports.Messages = Messages;

exports.PAD = PAD;
