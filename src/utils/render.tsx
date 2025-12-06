export const renderWithBreaks = (text: string | undefined | null) => {
  if (!text) return null;

  const lines = text.split("\n");

  return lines.map((line, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: index 이외 다른 기준 키 값이 없음..
    <span key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
};
