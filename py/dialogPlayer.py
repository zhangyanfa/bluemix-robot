#!/usr/bin/python
#encoding:utf-8
import sys,urllib
import os
from datetime import datetime
import argparse

#Baidu TTS Service
serverURL = 'http://tsn.baidu.com/text2audio'
#token = '24.de9b2e41eeb3bc55483bbe0c3003649f.2592000.1465615360.282335-7660754'
apiKey = '72ZLyNsGUp6SRWkyDaz2XehX'
secretKey = '9fa473c1113193fff6e5e93b7b6ac1de'
cuid = '60-67-20-39-32-DC'

#执行命令行专递的参数
parser = argparse.ArgumentParser()
parser.add_argument("--spd", help="display a square of a given number")
parser.add_argument("--file", help="display a square of a given number")
parser.add_argument("--txt", help="display a square of a given number")
parser.add_argument("--token", help="display a square of a given number")
args = parser.parse_args()
filename = args.file + ".mp3"
ttsTxt = args.txt
spd = args.spd
token = args.token

#ttsDecode = urllib.quote(ttsTxt.decode(sys.stdin.encoding).encode('utf8'))
#ttsTxt = '我是谁我是谁我是谁'

#ttsTxt = '好的，从前有一只蜜蜂在窗台边嗡嗡飞，嗡嗡嗡，嗡嗡嗡，嗡嗡嗡，嗡嗡嗡，嗡嗡嗡，嗡嗡嗡，嗡嗡嗡，嗡嗡嗡，嗡嗡嗡，嗡嗡嗡，如果你喜欢，我可以让它继续嗡嗡飞。'

#print ttsTxt

def Schedule(a,b,c):
    '''''
    a:已经下载的数据块
    b:数据块的大小
    c:远程文件的大小
   '''
    per = 100.0 * a * b / c
    if per > 100 :
        per = 100
    #print '%.2f%%' % per

#url = 'http://tsn.baidu.com/text2audio?cuid=60-67-20-39-32-DC&tok=24.3669895439d4b01cf3193f2d9428105e.2592000.1455622048.282335-7660754&ctp=1&lan=zh&tex=Hi,%20%E6%88%91%E6%98%AF%20Watson!%20%E8%AF%B7%E9%97%AE%E6%9C%89%E4%BB%80%E4%B9%88%E5%8F%AF%E4%BB%A5%E5%B8%AE%E4%BD%A0'
url = serverURL + '?cuid=' + cuid + '&tok=' + token + '&ctp=1&vol=9&pit=8&per=1&lan=zh' + '&tex=' + ttsTxt + '&spd=' + spd

#print url


filepath = '/home/pi/voice/tts_ch/'

#local = url.split('/')[-1]
local = os.path.join(filepath, filename )
urllib.urlretrieve(url,local,Schedule)

print filepath+filename

#播放MP3
#import subprocess

#subprocess.call('mplayer -volume 10 -ao alsa:device=btmi ' + filepath + filename, shell=True)