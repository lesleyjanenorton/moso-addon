/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
  Component
} from "./component.js";
import {
  Logger
} from './logger.js';

const log = Logger.logger('ContextMenus');

export class ContextMenus extends Component {
  constructor(register) {
    super(register);

    // Menus need to be created at the on-installed event.
    browser.runtime.onInstalled.addListener(() => {
      browser.menus.create({
        id: 'share',
        title: 'Share this URL',
        contexts: ['all'],
        enabled: false,
      });

      browser.menus.onClicked.addListener((info, tab) => {
        if (info.menuItemId !== 'share') {
          return;
        }
        this.sendMessage("shareURL", tab.url);
      });

      browser.menus.onShown.addListener(async (info, tab) => {
        const url = new URL(tab.url);
        browser.menus.update("share", {
          enabled: (this.state === STATE_MAIN && (url.protocol === 'http:' || url.protocol === 'https:'))
        });
        browser.menus.refresh();
      })
    });
  }
}