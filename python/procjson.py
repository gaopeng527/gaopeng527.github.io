import glob, os

dataPath='..\\data\\'
outPath ='..\\data2\\'

if not os.path.exists(outPath):
    os.mkdir(outPath)

fileLists =glob.glob(dataPath+'*.json')
for fName in fileLists:
    print 'my file name '+fName
    outFile = open(fName.replace('\\data\\', '\\data2\\'), 'w');
    outFile.write('[\n')
    lines = open(fName,'r').readlines()
    if lines[0].strip()=='[':
        lines=lines[1:]
    if lines[-1].strip()==']':
        lines=lines[:-2]
    totalLineCount = len(lines)
    lineCount = 0
    for line in lines:
        fields=line.rstrip().lstrip('{').rstrip(',').rstrip('}').split(',')
        if len(fields)<2:
            continue
        newFields=[]
        r=0
        validGPS=True
        for f in fields:
            k, v= f.split(':',1)
            if k in ['\"longitude\"', '\"latitude\"']:
                v=v.replace('+','')
                if float(v)==0:
                    validGPS=False
            else:
                v='\"'+v+'\"'
            newFields.append(':'.join([k,v]))
        lineCount+=1
        if lineCount<totalLineCount:
            newLine='{'+','.join(newFields)+'}'+',\n'
        else:
            newLine='{'+','.join(newFields)+'}'+'\n'
        if validGPS:
            outFile.write(newLine)
    outFile.write(']\n')
    outFile.close()
 
