export function sliceFile(file, index, sliceSize) {
  const start = index * sliceSize;
  const end = start + sliceSize;
  
  const blob = file.slice(start, end);
  const [filename, ext] = file.name.split('.');
  const blobFile = new File([blob], `${filename}${index}.${ext}`);
  const isLast = end > file.size;
  return { blobFile, isLast }
}