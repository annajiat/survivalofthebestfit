import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/controllers/constants/classes';
import EVENTS from '~/public/controllers/constants/events';
import UIBase from '~/public/components/interface/ui-base/ui-base';
import {spotlight} from '~/public/components/pixi/office';
import {eventEmitter, pixiApp} from '~/public/controllers/game/gameSetup.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.$id = '.js-yes-no';
        this.$el = $('.js-yes-no'); // This should be a single element
        this.$yesButton = this.$el.find('.js-yes');
        this.$noButton = this.$el.find('.js-no');
        this._addEventListeners();
    }

    _acceptClicked(e) {
        this.$yesButton.addClass(CLASSES.ACCEPTED);
        if (candidateInSpot != null) {
            eventEmitter.emit(EVENTS.ACCEPTED, {});
            this.hide();
        }
    }

    _rejectClicked(e) {
        this.$noButton.addClass(CLASSES.REJECTED);
        if (candidateInSpot != null) {
            eventEmitter.emit(EVENTS.REJECTED, {});
            this.hide();
        }
    }

    _addEventListeners() {
        this.$yesButton.click(this._acceptClicked.bind(this));
        this.$noButton.click(this._rejectClicked.bind(this));

        eventEmitter.on(EVENTS.STAGE_TWO_COMPLETED, (data) => {
            this.destroy();
        });
        eventEmitter.on(EVENTS.CHANGE_SPOTLIGHT_STATUS, this._spotlightStatusHandler.bind(this));
    };

    _removeEventListeners() {
        this.$yesButton.off();
        this.$noButton.off();

        eventEmitter.off(EVENTS.ACCEPTED, () => {});
        eventEmitter.off(EVENTS.REJECTED, () => {});
        eventEmitter.off(EVENTS.STAGE_TWO_COMPLETED, () => {});
        eventEmitter.off(EVENTS.CHANGE_SPOTLIGHT_STATUS, this._spotlightStatusHandler.bind(this));
    }

    _spotlightStatusHandler({spotlightOccupied, spotlightFill}) {
        if (spotlightOccupied) {
            spotlightFill ? '' : this.hide();
        } else {
            spotlightFill ? this.show() : '';
        }
    }

    show() {
        this.$el.css({
            'top': `${spotlight.y - 180}px`,
            'left': `${spotlight.x + 10}px`,
        });
        TweenLite.set(this.$id, {y: 5, xPercent: -50, opacity: 0});
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.to(this.$id, 0.2, {y: 0, opacity: 1, ease: Power1.easeInOut});
    }

    hide() {
        TweenLite.to(this.$id, 0.3, {y: 5, opacity: 0, ease: Power1.easeInOut});
        TweenLite.delayedCall(0.4, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
    }
}
