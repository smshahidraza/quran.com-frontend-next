/* eslint-disable max-lines -- verse tab catalog is a linear list */
import type { Dispatch } from '@reduxjs/toolkit';
import type { Translate } from 'next-translate';

import { TabId, type TabConfig } from './BottomActionsTabs';

import { StudyModeTabId } from '@/components/QuranReader/ReadingView/StudyModeModal/StudyModeBottomActions';
import BookIcon from '@/icons/book-open.svg';
import HadithIcon from '@/icons/bx-book.svg';
import ChatIcon from '@/icons/chat.svg';
import GraduationCapIcon from '@/icons/graduation-cap.svg';
import LayerIcon from '@/icons/layer.svg';
import LightbulbOnIcon from '@/icons/lightbulb-on.svg';
import LightbulbIcon from '@/icons/lightbulb.svg';
import QiraatIcon from '@/icons/qiraat-icon.svg';
import RelatedVersesIcon from '@/icons/related-verses.svg';
import SearchIcon from '@/icons/search.svg';
import { openStudyMode } from '@/redux/slices/QuranReader/studyMode';
import { logButtonClick } from '@/utils/eventLogger';
import {
  fakeNavigate,
  getVerseAnswersNavigationUrl,
  getVerseHadithsNavigationUrl,
  getVerseLessonNavigationUrl,
  getVerseLayersNavigationUrl,
  getVerseQiraatNavigationUrl,
  getVerseReflectionNavigationUrl,
  getVerseRelatedVersesNavigationUrl,
  getVerseSelectedTafsirNavigationUrl,
} from '@/utils/navigation';

type GetVerseBottomActionTabsParams = {
  t: Translate;
  lang: string;
  verseKey: string;
  chapterId: string;
  verseNumber: string;
  tafsirs: string[];
  isTranslationView: boolean;
  hasLayersData: boolean;
  hasQuestions: boolean;
  isClarificationQuestion: boolean;
  hasQiraatData: boolean;
  hasHadiths: boolean;
  hasRelatedVerses: boolean;
  dispatch: Dispatch;
};

const TAB_TO_STUDY_MODE: Record<TabId, StudyModeTabId | undefined> = {
  [TabId.TAFSIR]: StudyModeTabId.TAFSIR,
  [TabId.SYNTAX]: StudyModeTabId.SYNTAX,
  [TabId.LAYERS]: StudyModeTabId.LAYERS,
  [TabId.REFLECTIONS]: StudyModeTabId.REFLECTIONS,
  [TabId.LESSONS]: StudyModeTabId.LESSONS,
  [TabId.RELATED_VERSES]: StudyModeTabId.RELATED_VERSES,
  [TabId.ANSWERS]: StudyModeTabId.ANSWERS,
  [TabId.QIRAAT]: StudyModeTabId.QIRAAT,
  [TabId.HADITH]: StudyModeTabId.HADITH,
};

const createTabHandler = (
  params: Pick<
    GetVerseBottomActionTabsParams,
    'dispatch' | 'verseKey' | 'isTranslationView' | 'lang'
  >,
  tabType: TabId,
  navigationFn?: () => string,
) => {
  return () => {
    const studyModeTab = TAB_TO_STUDY_MODE[tabType];
    if (studyModeTab) {
      params.dispatch(openStudyMode({ verseKey: params.verseKey, activeTab: studyModeTab }));
    }

    const view = params.isTranslationView ? 'translation_view' : 'reading_view';
    logButtonClick(`${view}_verse_bottom_actions_${tabType}`);

    if (navigationFn) {
      fakeNavigate(navigationFn(), params.lang);
    }
  };
};

/**
 * Builds the verse action tab list for BottomActionsTabs.
 * @param {GetVerseBottomActionTabsParams} params - Verse, copy, and visibility flags.
 * @returns {TabConfig[]} Tabs to render under the verse.
 */
const getVerseBottomActionTabs = (params: GetVerseBottomActionTabsParams): TabConfig[] => {
  const {
    t,
    verseKey,
    chapterId,
    verseNumber,
    tafsirs,
    hasLayersData,
    hasQuestions,
    isClarificationQuestion,
    hasQiraatData,
    hasHadiths,
    hasRelatedVerses,
  } = params;
  const handler = (tabType: TabId, navigationFn?: () => string) =>
    createTabHandler(params, tabType, navigationFn);

  return [
    {
      id: TabId.TAFSIR,
      label: t('quran-reader:tafsirs'),
      icon: <BookIcon />,
      onClick: handler(TabId.TAFSIR, () =>
        getVerseSelectedTafsirNavigationUrl(chapterId, Number(verseNumber), tafsirs[0]),
      ),
      condition: true,
    },
    {
      id: TabId.SYNTAX,
      label: 'Syntax',
      icon: <SearchIcon color="var(--color-blue-buttons-and-icons)" />,
      onClick: handler(TabId.SYNTAX),
      condition: true,
    },
    {
      id: TabId.LAYERS,
      label: t('quran-reader:layers.title'),
      icon: <LayerIcon color="var(--color-blue-buttons-and-icons)" />,
      onClick: handler(TabId.LAYERS, () => getVerseLayersNavigationUrl(verseKey)),
      condition: hasLayersData,
    },
    {
      id: TabId.LESSONS,
      label: t('lessons'),
      icon: <GraduationCapIcon />,
      onClick: handler(TabId.LESSONS, () => getVerseLessonNavigationUrl(verseKey)),
      condition: true,
    },
    {
      id: TabId.REFLECTIONS,
      label: t('reflections'),
      icon: <ChatIcon />,
      onClick: handler(TabId.REFLECTIONS, () => getVerseReflectionNavigationUrl(verseKey)),
      condition: true,
    },
    {
      id: TabId.ANSWERS,
      label: t('answers'),
      icon: isClarificationQuestion ? <LightbulbOnIcon /> : <LightbulbIcon />,
      onClick: handler(TabId.ANSWERS, () => getVerseAnswersNavigationUrl(verseKey)),
      condition: hasQuestions,
    },
    {
      id: TabId.QIRAAT,
      label: t('quran-reader:qiraat.title'),
      icon: <QiraatIcon color="var(--color-blue-buttons-and-icons)" />,
      onClick: handler(TabId.QIRAAT, () => getVerseQiraatNavigationUrl(verseKey)),
      condition: hasQiraatData,
    },
    {
      id: TabId.HADITH,
      label: t('quran-reader:hadith.title'),
      icon: <HadithIcon color="var(--color-blue-buttons-and-icons)" />,
      onClick: handler(TabId.HADITH, () => getVerseHadithsNavigationUrl(verseKey)),
      condition: hasHadiths,
    },
    {
      id: TabId.RELATED_VERSES,
      label: t('related-verses'),
      icon: <RelatedVersesIcon />,
      onClick: handler(TabId.RELATED_VERSES, () => getVerseRelatedVersesNavigationUrl(verseKey)),
      condition: hasRelatedVerses,
    },
  ];
};

export default getVerseBottomActionTabs;
