import {
  ADD_TO_SHELF, CLEAR_SEARCH_HISTORY,
  DEL_ALL_SHELF,
  DEL_FROM_SHELF,
  INIT_STATE, SET_CUR_BOOK, SET_FONT_SIZE,
  SET_HEADER_INFO, SET_NIGHT_MODE, SET_SEARCH_HISTORY, SET_SKIN_COLOR,
  SHELF_BOOK_UPDATE
} from "./moutation-types";
import {getStore, removeStore, setStore} from "../utils/storage";

const mutations = {
  [INIT_STATE](state) {
    let initBookList = getStore('SHEFLBOOK');
    if (initBookList) {
      state.shelfBookList = JSON.parse(initBookList);
    }
    let initSearchHistory = getStore('SEARCHHISTORY');
    if (initSearchHistory) {
      state.searchHistory = JSON.parse(initSearchHistory);
    }

    state.nightMode = getStore('NIGHTMODE') === 'true' ? true : false;
    state.fontSize = Number.isInteger(getStore('FONTSIZE')) ? parseInt(getStore('FONTSIZE')) : 16;
    state.skinColor = getStore('SKINCOLOR');
  },

  [SET_HEADER_INFO](state, {
    title,
    type,
    items
  }) {
    state.headerTitle = title;
    state.headerType = type;
    state.headerItems=items;
  },

  [ADD_TO_SHELF](state, book) {
    let isExist = false;
    for (let shelfBook of Object.values(state.shelfBookList)) {
      if (shelfBook.id === book.id) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      state.shelfBookList.push(book);
      setStore('SHEFLBOOK', state.shelfBookList);
    }
  },

  [DEL_FROM_SHELF](state, bookIds) {
    state.shelfBookList = state.shelfBookList.filter(value => {
      return !bookIds.includes(value.id);
    });
    setStore('SHEFLBOOK', state.shelfBookList);
  },

  [DEL_ALL_SHELF](state) {
    state.shelfBookList.clear();
    removeStore('SHEFLBOOK');
  },
  [SHELF_BOOK_UPDATE](state, data) {
    for (let value of Object.values(data)) {
      for (let [idx, book] of Object.entries(state.shelfBookList)) {
        if (book.id === value._id) {
          book.updated = value.updated;
          book.lastChapter = value.lastChapter;
          state.shelfBookList[idx] = book;
          break;
        }
      }
      setStore('SHEFLBOOK', state.shelfBookList);
    }
  },
  [SET_CUR_BOOK](state, book) {
    state.curBook = book;
    if (state.curBook.isInShelf) {
      for (let [idx, shelfBook] of Object.entries(state.shelfBookList)) {
        if (shelfBook.id === state.curBook.id) {
          state.shelfBookList.splice(idx, 1, state.curBook);
          setStore('SHEFLBOOK', state.shelfBookList);
          break;
        }
      }
    }
  },

  [SET_NIGHT_MODE](state, isNight) {
    state.nightMode = isNight;
    setStore('NIGHTMODE', state.nightMode);
  },

  [SET_SKIN_COLOR](state, skinColor) {
    state.skinColor = skinColor;
    setStore('SKINCOLOR', state.skinColor);
  },

  [SET_FONT_SIZE](state, fontSize) {
    state.fontSize = fontSize;
    setStore('FONTSIZE', state.fontSize);
  },

  [SET_SEARCH_HISTORY](state, keyword) {
    if (state.searchHistory.indexOf(keyword) > -1) {
      state.searchHistory.splice(state.searchHistory.indexOf(keyword), 1);
    }
    state.searchHistory.unshift(keyword);
    setStore('SEARCHHISTORY', state.searchHistory);
  },

  [CLEAR_SEARCH_HISTORY](state) {
    state.searchHistory.splice(0, state.searchHistory.length);
    removeStore('SEARCHHISTORY');
  },
}

export default mutations
