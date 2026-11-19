import React from 'react';

import useTranslation from 'next-translate/useTranslation';
import { useDispatch, useSelector } from 'react-redux';

import BottomActionsTabs from './BottomActionsTabs';
import getVerseBottomActionTabs from './getVerseBottomActionTabs';

import useBatchedCountRangeHadiths from '@/hooks/auth/useBatchedCountRangeHadiths';
import useBatchedCountRangeLayeredTranslations from '@/hooks/auth/useBatchedCountRangeLayeredTranslations';
import useBatchedCountRangeQiraat from '@/hooks/auth/useBatchedCountRangeQiraat';
import useBatchedCountRangeQuestions from '@/hooks/auth/useBatchedCountRangeQuestions';
import { selectSelectedTafsirs } from '@/redux/slices/QuranReader/tafsirs';
import QuestionType from '@/types/QuestionsAndAnswers/QuestionType';
import { getVerseAndChapterNumbersFromKey } from '@/utils/verse';

interface BottomActionsProps {
  verseKey: string;
  isTranslationView?: boolean;
  hasRelatedVerses?: boolean;
  className?: string;
}

/**
 * Action tabs under a verse in translation/reading views.
 * @returns {JSX.Element} Tab bar for the given verse.
 */
const BottomActions = ({
  verseKey,
  isTranslationView = true,
  hasRelatedVerses = false,
  className,
}: BottomActionsProps): JSX.Element => {
  const { t, lang } = useTranslation('common');
  const dispatch = useDispatch();
  const tafsirs = useSelector(selectSelectedTafsirs);
  const [chapterId, verseNumber] = getVerseAndChapterNumbersFromKey(verseKey);

  const { data: questionsData } = useBatchedCountRangeQuestions(verseKey);
  const hasQuestions = questionsData?.total > 0;
  const isClarificationQuestion = !!questionsData?.types?.[QuestionType.CLARIFICATION];

  const { data: qiraatCount } = useBatchedCountRangeQiraat(verseKey);
  const hasQiraatData = (qiraatCount ?? 0) > 0;
  const { data: layersCount } = useBatchedCountRangeLayeredTranslations(verseKey);
  const hasLayersData = (layersCount ?? 0) > 0;

  const { data: hadithCount } = useBatchedCountRangeHadiths(verseKey);
  const hasHadiths = (hadithCount ?? 0) > 0;

  const tabs = getVerseBottomActionTabs({
    t,
    lang,
    verseKey,
    chapterId,
    verseNumber,
    tafsirs,
    isTranslationView,
    hasLayersData,
    hasQuestions,
    isClarificationQuestion,
    hasQiraatData,
    hasHadiths,
    hasRelatedVerses,
    dispatch,
  });

  return (
    <BottomActionsTabs tabs={tabs} isTranslationView={isTranslationView} className={className} />
  );
};

export default BottomActions;
