function generateYamlUpdateCommand(yamlFilePath, serviceName, newImage, hasService) {
  var indent = hasService ? '  ' : '    ';
  var awkCmd = "awk '/^" + indent + serviceName + ":/{f=1} f && /image:/{sub(/image:.*/, \"image: " + newImage + "\"); f=0} 1' " + yamlFilePath + " > temp && mv temp " + yamlFilePath;
  var verifyCmd = "sed -n '/^" + indent + serviceName + ":/,/image:/p' " + yamlFilePath;
  return awkCmd + '\n' + verifyCmd;
}

module.exports = generateYamlUpdateCommand;
