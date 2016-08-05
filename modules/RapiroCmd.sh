#echo "#M$*\n" | sudo minicom -b 57600 -o -D /dev/ttyAMA0

#echo $*

echo "#$*" | sudo minicom -b 57600 -o -D /dev/ttyAMA0

