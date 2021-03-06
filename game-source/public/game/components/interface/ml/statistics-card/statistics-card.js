import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import {clamp} from '~/public/game/controllers/common/utils';
import {statistics} from '~/public/game/controllers/machine-learning/statistics.js';

export default class {
    constructor(isManualStageStats) {
        let cv;
        if (isManualStageStats) {
            cv = statistics.getManualStats();
            this.$el = $('#statistics-card-manual');
        } else {
            cv = statistics.getMlLabStats();
            this.$el = $('#statistics-card-mllab');
        }
        statistics.getFeatures().forEach((feature, index) => {
            const skillScore = cv[index];
            const skillClass = `.${feature}`;
            const $skillEl = this.$el.find(skillClass);
            const width = clamp(skillScore, 5, 100);
            $skillEl.find(`.${CLASSES.STATS_CATEGORY}__progress`).css('width', `${width}%`);
        });
    }
}
