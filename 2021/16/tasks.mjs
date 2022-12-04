const input =
  '005532447836402684AC7AB3801A800021F0961146B1007A1147C89440294D005C12D2A7BC992D3F4E50C72CDF29EECFD0ACD5CC016962099194002CE31C5D3005F401296CAF4B656A46B2DE5588015C913D8653A3A001B9C3C93D7AC672F4FF78C136532E6E0007FCDFA975A3004B002E69EC4FD2D32CDF3FFDDAF01C91FCA7B41700263818025A00B48DEF3DFB89D26C3281A200F4C5AF57582527BC1890042DE00B4B324DBA4FAFCE473EF7CC0802B59DA28580212B3BD99A78C8004EC300761DC128EE40086C4F8E50F0C01882D0FE29900A01C01C2C96F38FCBB3E18C96F38FCBB3E1BCC57E2AA0154EDEC45096712A64A2520C6401A9E80213D98562653D98562612A06C0143CB03C529B5D9FD87CBA64F88CA439EC5BB299718023800D3CE7A935F9EA884F5EFAE9E10079125AF39E80212330F93EC7DAD7A9D5C4002A24A806A0062019B6600730173640575A0147C60070011FCA005000F7080385800CBEE006800A30C023520077A401840004BAC00D7A001FB31AAD10CC016923DA00686769E019DA780D0022394854167C2A56FB75200D33801F696D5B922F98B68B64E02460054CAE900949401BB80021D0562344E00042A16C6B8253000600B78020200E44386B068401E8391661C4E14B804D3B6B27CFE98E73BCF55B65762C402768803F09620419100661EC2A8CE0008741A83917CC024970D9E718DD341640259D80200008444D8F713C401D88310E2EC9F20F3330E059009118019A8803F12A0FC6E1006E3744183D27312200D4AC01693F5A131C93F5A131C970D6008867379CD3221289B13D402492EE377917CACEDB3695AD61C939C7C10082597E3740E857396499EA31980293F4FD206B40123CEE27CFB64D5E57B9ACC7F993D9495444001C998E66B50896B0B90050D34DF3295289128E73070E00A4E7A389224323005E801049351952694C000';

const BIN = [...input].reduce(
  (acc, char) => acc.concat(parseInt(char, 16).toString(2).padStart(4, '0')),
  ''
);

function task1(bin) {
  console.log('Parsing...');
  let data = parseBin(bin)[0];
  console.log('Versions:', addVersions(data));
}

function task2(bin) {
  let data = parseBin(bin)[0];
  console.log('Value:', findValue(data));
}

function findValue(object) {
  let data, result;
  try {
    if (typeof object.content === 'number') return object.content;
    if (Array.isArray(object.content)) data = object.content.map(findValue);
    if ([0, 1].includes(object.type))
      result =
        data.length >= 2
          ? data.reduce((acc, val) => {
              return object.type === 0 ? acc + val : acc * val;
            })
          : data[0];
    if (object.type === 2) result = Math.min(...data);
    if (object.type === 3) result = Math.max(...data);
    if (object.type === 5) result = data[0] > data[1] ? 1 : 0;
    if (object.type === 6) result = data[0] < data[1] ? 1 : 0;
    if (object.type === 7) result = data[0] === data[1] ? 1 : 0;
  } catch {
    console.log('Error @ ', object);
    result = 'error';
  }

  return result;
}

function addVersions(obj) {
  let result = 0;
  let queue = [obj];
  while (queue.length) {
    let current = queue.pop();
    if (current.version) result += current.version;
    if (typeof current.content !== 'number')
      queue.push(...current.content) || queue.push(current.content);
  }
  return result;
}

function parseBin(bin) {
  if (bin.length < 10) return [];
  let version = parseInt(bin.substring(0, 3), 2);
  let type = parseInt(bin.substring(3, 6), 2);
  let content = [];
  let result;
  if (isNaN(type)) return content;
  if (type === 4) {
    result = [];
    bin = bin.substring(6);
    let chunks = bin.match(/.{1,5}/g);
    let lastChunk = chunks.findIndex((chunk) => chunk[0] == '0');
    let thisContent = chunks.slice(0, lastChunk + 1);
    let remaining = chunks.slice(lastChunk + 1);
    thisContent = thisContent.reduce(
      (acc, chunk) => acc.concat(chunk.substring(1)),
      ''
    );
    content = parseInt(thisContent, 2);
    let nextBin = remaining.join('');
    result.push({ version, type, content });
    if (nextBin.length > 10) result.push(...parseBin(nextBin));
  } else {
    let lengthIndicator = bin.substring(6, 7) == '1' ? 11 : 15;
    if (lengthIndicator == 15) {
      let contentLength = parseInt(bin.substring(7, 7 + lengthIndicator), 2);
      content.push(
        ...parseBin(
          bin.substring(
            7 + lengthIndicator,
            7 + lengthIndicator + contentLength
          )
        )
      );
      result = [{ version, type, content }];
      result.push(
        ...parseBin(bin.substring(7 + lengthIndicator + contentLength))
      );
    }
    if (lengthIndicator == 11) {
      let contentLength = parseInt(bin.substring(7, 7 + lengthIndicator), 2);
      let chunks = parseBin(bin.substring(7 + lengthIndicator));
      content.push(...chunks.slice(0, contentLength));
      result = [{ version, type, content }];
      result.push(...chunks.slice(contentLength));
    }
  }

  return result;
}

task1(BIN);
task2(BIN);
