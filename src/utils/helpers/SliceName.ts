export  const sliceFilename =(filename: string, maxLength: number): string => {
    if (filename.length <= maxLength) {
      return filename;
    }

    const dotIndex = filename.lastIndexOf(".");
    if (dotIndex === -1 || dotIndex === 0) {
      return filename.slice(0, maxLength) + "...";
    }

    const name = filename.slice(0, dotIndex);
    const ext = filename.slice(dotIndex);

    const allowedNameLength = maxLength - ext.length;

    if (allowedNameLength <= 0) {
      return filename.slice(0, maxLength) + "...";
    }

    return name.slice(0, allowedNameLength) + "..." + ext;
  }