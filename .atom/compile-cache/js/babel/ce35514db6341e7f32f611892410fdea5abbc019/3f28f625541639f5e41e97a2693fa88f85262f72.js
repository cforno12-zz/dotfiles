function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _sbEventKit = require('sb-event-kit');

var _jasmineFix = require('jasmine-fix');

var _libCommands = require('../lib/commands');

var _libCommands2 = _interopRequireDefault(_libCommands);

var _helpers = require('./helpers');

describe('Commands', function () {
  var commands = undefined;
  var editorView = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    commands = new _libCommands2['default']();
    commands.activate();
    yield atom.workspace.open(__filename);
    editorView = atom.views.getView(atom.workspace.getActiveTextEditor());
  }));
  afterEach(function () {
    atom.workspace.destroyActivePane();
    commands.dispose();
  });
  function dispatchEventOnBody(event) {
    // $FlowIgnore: Document.body is never null in our case
    document.body.dispatchEvent(event);
  }

  describe('Highlights', function () {
    (0, _jasmineFix.it)('does nothing if not activated and we try to deactivate', function () {
      commands.processHighlightsHide();
    });
    (0, _jasmineFix.it)('does not activate unless provider tells it to', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(false);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(0);
    }));
    (0, _jasmineFix.it)('activates when the provider tells it to', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('throws if already highlighted', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      try {
        yield commands.processHighlightsShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processHighlightsShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      commands.processHighlightsHide();
      commands.processHighlightsHide();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes list if available', _asyncToGenerator(function* () {
      var disposed = false;
      var active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      active.subscriptions.add(function () {
        disposed = true;
      });
      commands.active = active;
      expect(disposed).toBe(false);
      yield commands.processHighlightsShow();
      expect(disposed).toBe(true);
    }));
    (0, _jasmineFix.it)('adds and removes classes appropriately', _asyncToGenerator(function* () {
      commands.onHighlightsShow(function () {
        return Promise.resolve(true);
      });
      expect(editorView.classList.contains('intentions-highlights')).toBe(false);
      yield commands.processHighlightsShow();
      expect(editorView.classList.contains('intentions-highlights')).toBe(true);
      commands.processHighlightsHide();
      expect(editorView.classList.contains('intentions-highlights')).toBe(false);
    }));
    describe('command listener', function () {
      (0, _jasmineFix.it)('just activates if theres no keyboard event attached', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.commands.dispatch(editorView, 'intentions:highlight');
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('ignores more than one activation requests', _asyncToGenerator(function* () {
        var timesShow = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes the keyboard listener when we dispose it with the class function', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        spyOn(commands, 'processHighlightsHide').andCallThrough();
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        expect(commands.processHighlightsHide.calls.length).toBe(1);
      }));
      (0, _jasmineFix.it)('just activates if keyboard event is not keydown', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('does not deactivate if keyup is not same keycode', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup', 1));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('does deactivate if keyup is the same keycode', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
    });
  });
  describe('Lists', function () {
    (0, _jasmineFix.it)('does nothing if deactivated and we try to activate it', function () {
      commands.processListHide();
    });
    (0, _jasmineFix.it)('does not pass on move events if not activated', function () {
      var callback = jasmine.createSpy('commands:list-move');
      commands.onListMove(callback);
      commands.processListMove('up');
      commands.processListMove('down');
      commands.processListMove('down');
      expect(callback).not.toHaveBeenCalled();
    });
    (0, _jasmineFix.it)('passes on move events if activated', function () {
      var callback = jasmine.createSpy('commands:list-move');
      commands.onListMove(callback);
      commands.processListMove('down');
      commands.processListMove('down');
      commands.processListMove('down');
      commands.active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.processListMove('down');
      commands.processListMove('down');
      commands.processListMove('down');
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.length).toBe(3);
    });
    (0, _jasmineFix.it)('ignores confirm if not activated', function () {
      var callback = jasmine.createSpy('commands:list-confirm');
      commands.onListConfirm(callback);
      commands.processListConfirm();
      commands.processListConfirm();
      commands.processListConfirm();
      commands.processListConfirm();
      expect(callback).not.toHaveBeenCalled();
    });
    (0, _jasmineFix.it)('passes on confirm if activated', function () {
      var callback = jasmine.createSpy('commands:list-confirm');
      commands.onListConfirm(callback);
      commands.processListConfirm();
      commands.processListConfirm();
      commands.active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.processListConfirm();
      commands.processListConfirm();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.length).toBe(2);
    });
    (0, _jasmineFix.it)('does not activate if listeners dont say that', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(false);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(0);
    }));
    (0, _jasmineFix.it)('activates when listeners allow', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('ignores if list is already active', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      commands.processListHide();
      commands.processListHide();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes if highlights are active', _asyncToGenerator(function* () {
      var disposed = false;
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
      commands.active = { type: 'highlight', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.active.subscriptions.add(function () {
        disposed = true;
      });
      expect(disposed).toBe(false);
      yield commands.processListShow();
      commands.processListHide();
      expect(disposed).toBe(true);
      expect(timesShow).toBe(2);
      expect(timesHide).toBe(2);
    }));
    (0, _jasmineFix.it)('adds and removes classes appropriately', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      expect(editorView.classList.contains('intentions-list')).toBe(false);
      yield commands.processListShow();
      expect(editorView.classList.contains('intentions-list')).toBe(true);
      commands.processListHide();
      expect(editorView.classList.contains('intentions-list')).toBe(false);
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes list on mouseup', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
      yield commands.processListShow();
      dispatchEventOnBody(new MouseEvent('mouseup'));
      yield (0, _jasmineFix.wait)(10);
      expect(timesShow).toBe(2);
      expect(timesHide).toBe(2);
    }));
    describe('command listener', function () {
      (0, _jasmineFix.it)('just enables when no keyboard event', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.commands.dispatch(editorView, 'intentions:show');
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('just enables when keyboard event is not keydown', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes the keyboard listener when we dispose it with the class function', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        spyOn(commands, 'processListHide').andCallThrough();
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        expect(commands.processListHide.calls.length).toBe(1);
      }));
      (0, _jasmineFix.it)('ignores more than one activation requests', _asyncToGenerator(function* () {
        var timesShow = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes itself on any commands other than known', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-up' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-down' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-confirm' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);

        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9zcGVjL2NvbW1hbmRzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzswQkFFb0MsY0FBYzs7MEJBQ2IsYUFBYTs7MkJBQzdCLGlCQUFpQjs7Ozt1QkFDTCxXQUFXOztBQUU1QyxRQUFRLENBQUMsVUFBVSxFQUFFLFlBQVc7QUFDOUIsTUFBSSxRQUFRLFlBQUEsQ0FBQTtBQUNaLE1BQUksVUFBVSxZQUFBLENBQUE7O0FBRWQsZ0RBQVcsYUFBaUI7QUFDMUIsWUFBUSxHQUFHLDhCQUFjLENBQUE7QUFDekIsWUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQ25CLFVBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDckMsY0FBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO0dBQ3RFLEVBQUMsQ0FBQTtBQUNGLFdBQVMsQ0FBQyxZQUFXO0FBQ25CLFFBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtBQUNsQyxZQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDbkIsQ0FBQyxDQUFBO0FBQ0YsV0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7O0FBRWxDLFlBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ25DOztBQUVELFVBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBVztBQUNoQyx3QkFBRyx3REFBd0QsRUFBRSxZQUFXO0FBQ3RFLGNBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0tBQ2pDLENBQUMsQ0FBQTtBQUNGLHdCQUFHLCtDQUErQyxvQkFBRSxhQUFpQjtBQUNuRSxVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsVUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLGNBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLGlCQUFTLEVBQUUsQ0FBQTtBQUNYLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM5QixDQUFDLENBQUE7QUFDRixjQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBVztBQUNuQyxpQkFBUyxFQUFFLENBQUE7T0FDWixDQUFDLENBQUE7QUFDRixZQUFNLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQ3RDLGNBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBOztBQUVoQyxZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFlBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDMUIsRUFBQyxDQUFBO0FBQ0Ysd0JBQUcseUNBQXlDLG9CQUFFLGFBQWlCO0FBQzdELFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsY0FBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVc7QUFDbkMsaUJBQVMsRUFBRSxDQUFBO0FBQ1gsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO09BQzdCLENBQUMsQ0FBQTtBQUNGLGNBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLGlCQUFTLEVBQUUsQ0FBQTtPQUNaLENBQUMsQ0FBQTtBQUNGLFlBQU0sUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDdEMsY0FBUSxDQUFDLHFCQUFxQixFQUFFLENBQUE7O0FBRWhDLFlBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsWUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUMxQixFQUFDLENBQUE7QUFDRix3QkFBRywrQkFBK0Isb0JBQUUsYUFBaUI7QUFDbkQsVUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixjQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBVztBQUNuQyxpQkFBUyxFQUFFLENBQUE7QUFDWCxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDN0IsQ0FBQyxDQUFBO0FBQ0YsY0FBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVc7QUFDbkMsaUJBQVMsRUFBRSxDQUFBO09BQ1osQ0FBQyxDQUFBO0FBQ0YsWUFBTSxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUN0QyxVQUFJO0FBQ0YsY0FBTSxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUN0QyxjQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ3pCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxjQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO09BQzdDO0FBQ0QsVUFBSTtBQUNGLGNBQU0sUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDdEMsY0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUN6QixDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsY0FBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtPQUM3QztBQUNELGNBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQ2hDLGNBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQ2hDLGNBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBOztBQUVoQyxZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFlBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDMUIsRUFBQyxDQUFBO0FBQ0Ysd0JBQUcsNEJBQTRCLG9CQUFFLGFBQWlCO0FBQ2hELFVBQUksUUFBUSxHQUFHLEtBQUssQ0FBQTtBQUNwQixVQUFNLE1BQU0sR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLHFDQUF5QixFQUFFLENBQUE7QUFDekUsWUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNsQyxnQkFBUSxHQUFHLElBQUksQ0FBQTtPQUNoQixDQUFDLENBQUE7QUFDRixjQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUN4QixZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVCLFlBQU0sUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDdEMsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUM1QixFQUFDLENBQUE7QUFDRix3QkFBRyx3Q0FBd0Msb0JBQUUsYUFBaUI7QUFDNUQsY0FBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVc7QUFDbkMsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO09BQzdCLENBQUMsQ0FBQTtBQUNGLFlBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzFFLFlBQU0sUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDdEMsWUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDekUsY0FBUSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDaEMsWUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDM0UsRUFBQyxDQUFBO0FBQ0YsWUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQVc7QUFDdEMsMEJBQUcscURBQXFELG9CQUFFLGFBQWlCO0FBQ3pFLFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixZQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLG1CQUFTLEVBQUUsQ0FBQTtBQUNYLGlCQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDN0IsQ0FBQyxDQUFBO0FBQ0YsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLG1CQUFTLEVBQUUsQ0FBQTtTQUNaLENBQUMsQ0FBQTtBQUNGLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixZQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsc0JBQXNCLENBQUMsQ0FBQTtBQUMxRCxjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLDJCQUFtQixDQUFDLCtCQUFpQixPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQzlDLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsZ0JBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQ2hDLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMxQixFQUFDLENBQUE7QUFDRiwwQkFBRywyQ0FBMkMsb0JBQUUsYUFBaUI7QUFDL0QsWUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLGdCQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBVztBQUNuQyxtQkFBUyxFQUFFLENBQUE7QUFDWCxpQkFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzdCLENBQUMsQ0FBQTtBQUNGLFlBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLCtCQUFpQixVQUFVLENBQUMsQ0FBQyxDQUFBO0FBQ25HLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxZQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLHNCQUFzQixFQUFFLFVBQVUsRUFBRSwrQkFBaUIsVUFBVSxDQUFDLENBQUMsQ0FBQTtBQUNuRyxjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsWUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsK0JBQWlCLFVBQVUsQ0FBQyxDQUFDLENBQUE7QUFDbkcsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDMUIsRUFBQyxDQUFBO0FBQ0YsMEJBQUcsMkVBQTJFLG9CQUFFLGFBQWlCO0FBQy9GLFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixZQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLG1CQUFTLEVBQUUsQ0FBQTtBQUNYLGlCQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDN0IsQ0FBQyxDQUFBO0FBQ0YsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLG1CQUFTLEVBQUUsQ0FBQTtTQUNaLENBQUMsQ0FBQTtBQUNGLGFBQUssQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUN6RCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsK0JBQWlCLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDbEcsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGdCQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUNoQyxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsMkJBQW1CLENBQUMsK0JBQWlCLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDOUMsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDNUQsRUFBQyxDQUFBO0FBQ0YsMEJBQUcsaURBQWlELG9CQUFFLGFBQWlCO0FBQ3JFLFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixZQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLG1CQUFTLEVBQUUsQ0FBQTtBQUNYLGlCQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDN0IsQ0FBQyxDQUFBO0FBQ0YsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLG1CQUFTLEVBQUUsQ0FBQTtTQUNaLENBQUMsQ0FBQTtBQUNGLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixZQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLHNCQUFzQixFQUFFLFVBQVUsRUFBRSwrQkFBaUIsVUFBVSxDQUFDLENBQUMsQ0FBQTtBQUNuRyxjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLDJCQUFtQixDQUFDLCtCQUFpQixPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQzlDLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsZ0JBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQ2hDLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMxQixFQUFDLENBQUE7QUFDRiwwQkFBRyxrREFBa0Qsb0JBQUUsYUFBaUI7QUFDdEUsWUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixnQkFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVc7QUFDbkMsbUJBQVMsRUFBRSxDQUFBO0FBQ1gsaUJBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUM3QixDQUFDLENBQUE7QUFDRixnQkFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVc7QUFDbkMsbUJBQVMsRUFBRSxDQUFBO1NBQ1osQ0FBQyxDQUFBO0FBQ0YsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFlBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLCtCQUFpQixTQUFTLENBQUMsQ0FBQyxDQUFBO0FBQ2xHLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsMkJBQW1CLENBQUMsK0JBQWlCLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pELGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsZ0JBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQ2hDLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMxQixFQUFDLENBQUE7QUFDRiwwQkFBRyw4Q0FBOEMsb0JBQUUsYUFBaUI7QUFDbEUsWUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixnQkFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVc7QUFDbkMsbUJBQVMsRUFBRSxDQUFBO0FBQ1gsaUJBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUM3QixDQUFDLENBQUE7QUFDRixnQkFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVc7QUFDbkMsbUJBQVMsRUFBRSxDQUFBO1NBQ1osQ0FBQyxDQUFBO0FBQ0YsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFlBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLCtCQUFpQixTQUFTLENBQUMsQ0FBQyxDQUFBO0FBQ2xHLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsMkJBQW1CLENBQUMsK0JBQWlCLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDOUMsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixnQkFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDaEMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQzFCLEVBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtBQUNGLFVBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUMzQix3QkFBRyx1REFBdUQsRUFBRSxZQUFXO0FBQ3JFLGNBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtLQUMzQixDQUFDLENBQUE7QUFDRix3QkFBRywrQ0FBK0MsRUFBRSxZQUFXO0FBQzdELFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUN4RCxjQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdCLGNBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDOUIsY0FBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoQyxjQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hDLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtLQUN4QyxDQUFDLENBQUE7QUFDRix3QkFBRyxvQ0FBb0MsRUFBRSxZQUFXO0FBQ2xELFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUN4RCxjQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdCLGNBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEMsY0FBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoQyxjQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hDLGNBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxxQ0FBeUIsRUFBRSxDQUFBO0FBQzVFLGNBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEMsY0FBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoQyxjQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hDLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0FBQ25DLFlBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUN0QyxDQUFDLENBQUE7QUFDRix3QkFBRyxrQ0FBa0MsRUFBRSxZQUFXO0FBQ2hELFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUMzRCxjQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLGNBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQzdCLGNBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQzdCLGNBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQzdCLGNBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQzdCLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtLQUN4QyxDQUFDLENBQUE7QUFDRix3QkFBRyxnQ0FBZ0MsRUFBRSxZQUFXO0FBQzlDLFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUMzRCxjQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLGNBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQzdCLGNBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQzdCLGNBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxxQ0FBeUIsRUFBRSxDQUFBO0FBQzVFLGNBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQzdCLGNBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQzdCLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0FBQ25DLFlBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUN0QyxDQUFDLENBQUE7QUFDRix3QkFBRyw4Q0FBOEMsb0JBQUUsYUFBaUI7QUFDbEUsVUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixjQUFRLENBQUMsVUFBVSxDQUFDLFlBQVc7QUFDN0IsaUJBQVMsRUFBRSxDQUFBO0FBQ1gsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzlCLENBQUMsQ0FBQTtBQUNGLGNBQVEsQ0FBQyxVQUFVLENBQUMsWUFBVztBQUM3QixpQkFBUyxFQUFFLENBQUE7T0FDWixDQUFDLENBQUE7QUFDRixZQUFNLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNoQyxjQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDMUIsWUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQzFCLEVBQUMsQ0FBQTtBQUNGLHdCQUFHLGdDQUFnQyxvQkFBRSxhQUFpQjtBQUNwRCxVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsVUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLGNBQVEsQ0FBQyxVQUFVLENBQUMsWUFBVztBQUM3QixpQkFBUyxFQUFFLENBQUE7QUFDWCxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDN0IsQ0FBQyxDQUFBO0FBQ0YsY0FBUSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQzdCLGlCQUFTLEVBQUUsQ0FBQTtPQUNaLENBQUMsQ0FBQTtBQUNGLFlBQU0sUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ2hDLGNBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUMxQixZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFlBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDMUIsRUFBQyxDQUFBO0FBQ0Ysd0JBQUcsbUNBQW1DLG9CQUFFLGFBQWlCO0FBQ3ZELFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsY0FBUSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQzdCLGlCQUFTLEVBQUUsQ0FBQTtBQUNYLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUM3QixDQUFDLENBQUE7QUFDRixjQUFRLENBQUMsVUFBVSxDQUFDLFlBQVc7QUFDN0IsaUJBQVMsRUFBRSxDQUFBO09BQ1osQ0FBQyxDQUFBO0FBQ0YsWUFBTSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDaEMsVUFBSTtBQUNGLGNBQU0sUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ2hDLGNBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDekIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGNBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7T0FDN0M7QUFDRCxVQUFJO0FBQ0YsY0FBTSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDaEMsY0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUN6QixDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsY0FBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtPQUM3QztBQUNELFVBQUk7QUFDRixjQUFNLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNoQyxjQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ3pCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxjQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO09BQzdDO0FBQ0QsY0FBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQzFCLGNBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUMxQixjQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDMUIsWUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQzFCLEVBQUMsQ0FBQTtBQUNGLHdCQUFHLG1DQUFtQyxvQkFBRSxhQUFpQjtBQUN2RCxVQUFJLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDcEIsVUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixjQUFRLENBQUMsVUFBVSxDQUFDLFlBQVc7QUFDN0IsaUJBQVMsRUFBRSxDQUFBO0FBQ1gsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO09BQzdCLENBQUMsQ0FBQTtBQUNGLGNBQVEsQ0FBQyxVQUFVLENBQUMsWUFBVztBQUM3QixpQkFBUyxFQUFFLENBQUE7T0FDWixDQUFDLENBQUE7QUFDRixZQUFNLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNoQyxjQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDMUIsWUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxxQ0FBeUIsRUFBRSxDQUFBO0FBQ2pGLGNBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFXO0FBQzNDLGdCQUFRLEdBQUcsSUFBSSxDQUFBO09BQ2hCLENBQUMsQ0FBQTtBQUNGLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUIsWUFBTSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDaEMsY0FBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQzFCLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0IsWUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQzFCLEVBQUMsQ0FBQTtBQUNGLHdCQUFHLHdDQUF3QyxvQkFBRSxhQUFpQjtBQUM1RCxVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsVUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLGNBQVEsQ0FBQyxVQUFVLENBQUMsWUFBVztBQUM3QixpQkFBUyxFQUFFLENBQUE7QUFDWCxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDN0IsQ0FBQyxDQUFBO0FBQ0YsY0FBUSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQzdCLGlCQUFTLEVBQUUsQ0FBQTtPQUNaLENBQUMsQ0FBQTtBQUNGLFlBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3BFLFlBQU0sUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ2hDLFlBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ25FLGNBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUMxQixZQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwRSxZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFlBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDMUIsRUFBQyxDQUFBO0FBQ0Ysd0JBQUcsMEJBQTBCLG9CQUFFLGFBQWlCO0FBQzlDLFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsY0FBUSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQzdCLGlCQUFTLEVBQUUsQ0FBQTtBQUNYLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUM3QixDQUFDLENBQUE7QUFDRixjQUFRLENBQUMsVUFBVSxDQUFDLFlBQVc7QUFDN0IsaUJBQVMsRUFBRSxDQUFBO09BQ1osQ0FBQyxDQUFBO0FBQ0YsWUFBTSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDaEMsY0FBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQzFCLFlBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsWUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixZQUFNLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNoQyx5QkFBbUIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBQzlDLFlBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFlBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDMUIsRUFBQyxDQUFBO0FBQ0YsWUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQVc7QUFDdEMsMEJBQUcscUNBQXFDLG9CQUFFLGFBQWlCO0FBQ3pELFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixZQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsZ0JBQVEsQ0FBQyxVQUFVLENBQUMsWUFBVztBQUM3QixtQkFBUyxFQUFFLENBQUE7QUFDWCxpQkFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzdCLENBQUMsQ0FBQTtBQUNGLGdCQUFRLENBQUMsVUFBVSxDQUFDLFlBQVc7QUFDN0IsbUJBQVMsRUFBRSxDQUFBO1NBQ1osQ0FBQyxDQUFBO0FBQ0YsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUE7QUFDckQsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QiwyQkFBbUIsQ0FBQywrQkFBaUIsT0FBTyxDQUFDLENBQUMsQ0FBQTtBQUM5QyxjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGdCQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDMUIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQzFCLEVBQUMsQ0FBQTtBQUNGLDBCQUFHLGlEQUFpRCxvQkFBRSxhQUFpQjtBQUNyRSxZQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsWUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLGdCQUFRLENBQUMsVUFBVSxDQUFDLFlBQVc7QUFDN0IsbUJBQVMsRUFBRSxDQUFBO0FBQ1gsaUJBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUM3QixDQUFDLENBQUE7QUFDRixnQkFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQzdCLG1CQUFTLEVBQUUsQ0FBQTtTQUNaLENBQUMsQ0FBQTtBQUNGLFlBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLCtCQUFpQixVQUFVLENBQUMsQ0FBQyxDQUFBO0FBQzlGLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsMkJBQW1CLENBQUMsK0JBQWlCLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDOUMsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixnQkFBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQzFCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMxQixFQUFDLENBQUE7QUFDRiwwQkFBRywyRUFBMkUsb0JBQUUsYUFBaUI7QUFDL0YsWUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixnQkFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQzdCLG1CQUFTLEVBQUUsQ0FBQTtBQUNYLGlCQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDN0IsQ0FBQyxDQUFBO0FBQ0YsZ0JBQVEsQ0FBQyxVQUFVLENBQUMsWUFBVztBQUM3QixtQkFBUyxFQUFFLENBQUE7U0FDWixDQUFDLENBQUE7QUFDRixhQUFLLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDbkQsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFlBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLCtCQUFpQixVQUFVLENBQUMsQ0FBQyxDQUFBO0FBQzlGLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxnQkFBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQzFCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QiwyQkFBbUIsQ0FBQywrQkFBaUIsT0FBTyxDQUFDLENBQUMsQ0FBQTtBQUM5QyxjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDdEQsRUFBQyxDQUFBO0FBQ0YsMEJBQUcsMkNBQTJDLG9CQUFFLGFBQWlCO0FBQy9ELFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixnQkFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQzdCLG1CQUFTLEVBQUUsQ0FBQTtBQUNYLGlCQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDN0IsQ0FBQyxDQUFBO0FBQ0YsWUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsK0JBQWlCLFVBQVUsQ0FBQyxDQUFDLENBQUE7QUFDOUYsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLFlBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLCtCQUFpQixVQUFVLENBQUMsQ0FBQyxDQUFBO0FBQzlGLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxZQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFLFVBQVUsRUFBRSwrQkFBaUIsVUFBVSxDQUFDLENBQUMsQ0FBQTtBQUM5RixjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMxQixFQUFDLENBQUE7QUFDRiwwQkFBRyxrREFBa0Qsb0JBQUUsYUFBaUI7QUFDdEUsWUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixnQkFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQzdCLG1CQUFTLEVBQUUsQ0FBQTtBQUNYLGlCQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDN0IsQ0FBQyxDQUFBO0FBQ0YsZ0JBQVEsQ0FBQyxVQUFVLENBQUMsWUFBVztBQUM3QixtQkFBUyxFQUFFLENBQUE7U0FDWixDQUFDLENBQUE7QUFDRixZQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFLFVBQVUsRUFBRSwrQkFBaUIsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUM3RixjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLDJCQUFtQixDQUFDLCtCQUFpQixPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQzlDLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXpCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDeEYsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLDJCQUFtQixDQUFDLCtCQUFpQixPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQzlDLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXpCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUMxRixjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsMkJBQW1CLENBQUMsK0JBQWlCLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDOUMsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFekIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzdGLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCwyQkFBbUIsQ0FBQywrQkFBaUIsT0FBTyxDQUFDLENBQUMsQ0FBQTtBQUM5QyxjQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV6QixnQkFBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQzFCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMxQixFQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvY29tbWFuZHMtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgeyBpdCwgYmVmb3JlRWFjaCwgd2FpdCB9IGZyb20gJ2phc21pbmUtZml4J1xuaW1wb3J0IENvbW1hbmRzIGZyb20gJy4uL2xpYi9jb21tYW5kcydcbmltcG9ydCB7IGdldEtleWJvYXJkRXZlbnQgfSBmcm9tICcuL2hlbHBlcnMnXG5cbmRlc2NyaWJlKCdDb21tYW5kcycsIGZ1bmN0aW9uKCkge1xuICBsZXQgY29tbWFuZHNcbiAgbGV0IGVkaXRvclZpZXdcblxuICBiZWZvcmVFYWNoKGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgIGNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICBjb21tYW5kcy5hY3RpdmF0ZSgpXG4gICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihfX2ZpbGVuYW1lKVxuICAgIGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICB9KVxuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmUoKVxuICAgIGNvbW1hbmRzLmRpc3Bvc2UoKVxuICB9KVxuICBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50T25Cb2R5KGV2ZW50KSB7XG4gICAgLy8gJEZsb3dJZ25vcmU6IERvY3VtZW50LmJvZHkgaXMgbmV2ZXIgbnVsbCBpbiBvdXIgY2FzZVxuICAgIGRvY3VtZW50LmJvZHkuZGlzcGF0Y2hFdmVudChldmVudClcbiAgfVxuXG4gIGRlc2NyaWJlKCdIaWdobGlnaHRzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2RvZXMgbm90aGluZyBpZiBub3QgYWN0aXZhdGVkIGFuZCB3ZSB0cnkgdG8gZGVhY3RpdmF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBhY3RpdmF0ZSB1bmxlc3MgcHJvdmlkZXIgdGVsbHMgaXQgdG8nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgfSlcbiAgICBpdCgnYWN0aXZhdGVzIHdoZW4gdGhlIHByb3ZpZGVyIHRlbGxzIGl0IHRvJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgndGhyb3dzIGlmIGFscmVhZHkgaGlnaGxpZ2h0ZWQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICAgIGV4cGVjdChmYWxzZSkudG9CZSh0cnVlKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvQmUoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICAgIGV4cGVjdChmYWxzZSkudG9CZSh0cnVlKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvQmUoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgIH1cbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcblxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2Rpc3Bvc2VzIGxpc3QgaWYgYXZhaWxhYmxlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgZGlzcG9zZWQgPSBmYWxzZVxuICAgICAgY29uc3QgYWN0aXZlID0geyB0eXBlOiAnbGlzdCcsIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgYWN0aXZlLnN1YnNjcmlwdGlvbnMuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgICBkaXNwb3NlZCA9IHRydWVcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5hY3RpdmUgPSBhY3RpdmVcbiAgICAgIGV4cGVjdChkaXNwb3NlZCkudG9CZShmYWxzZSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICBleHBlY3QoZGlzcG9zZWQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICAgIGl0KCdhZGRzIGFuZCByZW1vdmVzIGNsYXNzZXMgYXBwcm9wcmlhdGVseScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChlZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaW50ZW50aW9ucy1oaWdobGlnaHRzJykpLnRvQmUoZmFsc2UpXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuICAgICAgZXhwZWN0KGVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnRlbnRpb25zLWhpZ2hsaWdodHMnKSkudG9CZSh0cnVlKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgIGV4cGVjdChlZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaW50ZW50aW9ucy1oaWdobGlnaHRzJykpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgICBkZXNjcmliZSgnY29tbWFuZCBsaXN0ZW5lcicsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ2p1c3QgYWN0aXZhdGVzIGlmIHRoZXJlcyBubyBrZXlib2FyZCBldmVudCBhdHRhY2hlZCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvclZpZXcsICdpbnRlbnRpb25zOmhpZ2hsaWdodCcpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnaWdub3JlcyBtb3JlIHRoYW4gb25lIGFjdGl2YXRpb24gcmVxdWVzdHMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpoaWdobGlnaHQnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdkaXNwb3NlcyB0aGUga2V5Ym9hcmQgbGlzdGVuZXIgd2hlbiB3ZSBkaXNwb3NlIGl0IHdpdGggdGhlIGNsYXNzIGZ1bmN0aW9uJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgc3B5T24oY29tbWFuZHMsICdwcm9jZXNzSGlnaGxpZ2h0c0hpZGUnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5ZG93bicpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZS5jYWxscy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnanVzdCBhY3RpdmF0ZXMgaWYga2V5Ym9hcmQgZXZlbnQgaXMgbm90IGtleWRvd24nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDApXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnZG9lcyBub3QgZGVhY3RpdmF0ZSBpZiBrZXl1cCBpcyBub3Qgc2FtZSBrZXljb2RlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgwKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpoaWdobGlnaHQnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlkb3duJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJywgMSkpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnZG9lcyBkZWFjdGl2YXRlIGlmIGtleXVwIGlzIHRoZSBzYW1lIGtleWNvZGUnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDApXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleWRvd24nKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuICBkZXNjcmliZSgnTGlzdHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnZG9lcyBub3RoaW5nIGlmIGRlYWN0aXZhdGVkIGFuZCB3ZSB0cnkgdG8gYWN0aXZhdGUgaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgfSlcbiAgICBpdCgnZG9lcyBub3QgcGFzcyBvbiBtb3ZlIGV2ZW50cyBpZiBub3QgYWN0aXZhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjb21tYW5kczpsaXN0LW1vdmUnKVxuICAgICAgY29tbWFuZHMub25MaXN0TW92ZShjYWxsYmFjaylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgndXAnKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBleHBlY3QoY2FsbGJhY2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICAgIGl0KCdwYXNzZXMgb24gbW92ZSBldmVudHMgaWYgYWN0aXZhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjb21tYW5kczpsaXN0LW1vdmUnKVxuICAgICAgY29tbWFuZHMub25MaXN0TW92ZShjYWxsYmFjaylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGNvbW1hbmRzLmFjdGl2ZSA9IHsgdHlwZTogJ2xpc3QnLCBzdWJzY3JpcHRpb25zOiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpIH1cbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGV4cGVjdChjYWxsYmFjaykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QoY2FsbGJhY2suY2FsbHMubGVuZ3RoKS50b0JlKDMpXG4gICAgfSlcbiAgICBpdCgnaWdub3JlcyBjb25maXJtIGlmIG5vdCBhY3RpdmF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NvbW1hbmRzOmxpc3QtY29uZmlybScpXG4gICAgICBjb21tYW5kcy5vbkxpc3RDb25maXJtKGNhbGxiYWNrKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGV4cGVjdChjYWxsYmFjaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gICAgaXQoJ3Bhc3NlcyBvbiBjb25maXJtIGlmIGFjdGl2YXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY29tbWFuZHM6bGlzdC1jb25maXJtJylcbiAgICAgIGNvbW1hbmRzLm9uTGlzdENvbmZpcm0oY2FsbGJhY2spXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGNvbW1hbmRzLmFjdGl2ZSA9IHsgdHlwZTogJ2xpc3QnLCBzdWJzY3JpcHRpb25zOiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpIH1cbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxscy5sZW5ndGgpLnRvQmUoMilcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBhY3RpdmF0ZSBpZiBsaXN0ZW5lcnMgZG9udCBzYXkgdGhhdCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgfSlcbiAgICBpdCgnYWN0aXZhdGVzIHdoZW4gbGlzdGVuZXJzIGFsbG93JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2lnbm9yZXMgaWYgbGlzdCBpcyBhbHJlYWR5IGFjdGl2ZScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9CZSgnQWxyZWFkeSBhY3RpdmUnKVxuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9CZSgnQWxyZWFkeSBhY3RpdmUnKVxuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleHBlY3QoZXJyb3IubWVzc2FnZSkudG9CZSgnQWxyZWFkeSBhY3RpdmUnKVxuICAgICAgfVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2Rpc3Bvc2VzIGlmIGhpZ2hsaWdodHMgYXJlIGFjdGl2ZScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGRpc3Bvc2VkID0gZmFsc2VcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICBjb21tYW5kcy5hY3RpdmUgPSB7IHR5cGU6ICdoaWdobGlnaHQnLCBzdWJzY3JpcHRpb25zOiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpIH1cbiAgICAgIGNvbW1hbmRzLmFjdGl2ZS5zdWJzY3JpcHRpb25zLmFkZChmdW5jdGlvbigpIHtcbiAgICAgICAgZGlzcG9zZWQgPSB0cnVlXG4gICAgICB9KVxuICAgICAgZXhwZWN0KGRpc3Bvc2VkKS50b0JlKGZhbHNlKVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QoZGlzcG9zZWQpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMilcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMilcbiAgICB9KVxuICAgIGl0KCdhZGRzIGFuZCByZW1vdmVzIGNsYXNzZXMgYXBwcm9wcmlhdGVseScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtbGlzdCcpKS50b0JlKGZhbHNlKVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGV4cGVjdChlZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaW50ZW50aW9ucy1saXN0JykpLnRvQmUodHJ1ZSlcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtbGlzdCcpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2Rpc3Bvc2VzIGxpc3Qgb24gbW91c2V1cCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KG5ldyBNb3VzZUV2ZW50KCdtb3VzZXVwJykpXG4gICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgyKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgyKVxuICAgIH0pXG4gICAgZGVzY3JpYmUoJ2NvbW1hbmQgbGlzdGVuZXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdqdXN0IGVuYWJsZXMgd2hlbiBubyBrZXlib2FyZCBldmVudCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yVmlldywgJ2ludGVudGlvbnM6c2hvdycpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnanVzdCBlbmFibGVzIHdoZW4ga2V5Ym9hcmQgZXZlbnQgaXMgbm90IGtleWRvd24nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6c2hvdycsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnZGlzcG9zZXMgdGhlIGtleWJvYXJkIGxpc3RlbmVyIHdoZW4gd2UgZGlzcG9zZSBpdCB3aXRoIHRoZSBjbGFzcyBmdW5jdGlvbicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIHNweU9uKGNvbW1hbmRzLCAncHJvY2Vzc0xpc3RIaWRlJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDApXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOnNob3cnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZS5jYWxscy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnaWdub3JlcyBtb3JlIHRoYW4gb25lIGFjdGl2YXRpb24gcmVxdWVzdHMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOnNob3cnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6c2hvdycsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpzaG93JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdkaXNwb3NlcyBpdHNlbGYgb24gYW55IGNvbW1hbmRzIG90aGVyIHRoYW4ga25vd24nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6c2hvdycsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleWRvd24nKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG5cbiAgICAgICAgYXRvbS5rZXltYXBzLmVtaXR0ZXIuZW1pdCgnZGlkLW1hdGNoLWJpbmRpbmcnLCB7IGJpbmRpbmc6IHsgY29tbWFuZDogJ2NvcmU6bW92ZS11cCcgfSB9KVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuXG4gICAgICAgIGF0b20ua2V5bWFwcy5lbWl0dGVyLmVtaXQoJ2RpZC1tYXRjaC1iaW5kaW5nJywgeyBiaW5kaW5nOiB7IGNvbW1hbmQ6ICdjb3JlOm1vdmUtZG93bicgfSB9KVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuXG4gICAgICAgIGF0b20ua2V5bWFwcy5lbWl0dGVyLmVtaXQoJ2RpZC1tYXRjaC1iaW5kaW5nJywgeyBiaW5kaW5nOiB7IGNvbW1hbmQ6ICdjb3JlOm1vdmUtY29uZmlybScgfSB9KVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuXG4gICAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==