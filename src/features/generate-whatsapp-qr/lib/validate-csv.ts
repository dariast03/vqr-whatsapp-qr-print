 const readCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length > 40) {
     

        return;
      }

      const data = lines.map((line) =>
        line.split(',').map((cell) => cell.trim())
      );
      
      return data;
    };
    reader.readAsText(file);
  };