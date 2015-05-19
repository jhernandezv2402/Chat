(function() {
  'use strict';
  angular.module('ngDragAndDrop', [])
    .directive('fileDropzone', function ($document) {
      return {
        restrict: 'A',
        scope: {
          file: '=',
          fileName: '=',
          algo: '&'
        },
        link: function(scope, element, attrs) {
          var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
          processDragOverOrEnter = function(event) {
            event.stopPropagation();
            event.preventDefault();
            if (event != null) {
              event.preventDefault();
            }
            event.dataTransfer.dropEffect = 'copy';
            return false;
          };
          validMimeTypes = attrs.fileDropzone;
          checkSize = function(size) {
            var _ref;
            if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
              return true;
            } else {
              alert("File must be smaller than " + attrs.maxFileSize + " MB");
              return false;
            }
          };
          isTypeValid = function(type) {
            if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
              return true;
            } else {
              alert("Invalid file type.  File must be one of following types " + validMimeTypes);
              return false;
            }
          };
          element.bind('click', function(event) {
            var fileInput = document.getElementById('upload');
            fileInput.click();
            fileInput.onchange = function(evt) {
              var file, name, reader, size, type;
              var files = evt.target.files; // FileList object
              file = files[0];
              reader = new FileReader();

              // Closure to capture the file information.
              reader.onload = function (theFile) {
                if (checkSize(file.size) && isTypeValid(file.type)) {
                  return scope.$apply(function() {
                    scope.file = theFile.target.result;
                    if (angular.isString(scope.fileName)) {
                      return scope.fileName = file.name;
                      console.log(scope)
                    }
                  });
                }
              };
              if(file) {
                name = file.name;
                type = file.type;
                size = file.size;
                reader.readAsDataURL(file);
                return false;
              } else {
                return false;
              }
            }
          });
          element.bind('dragover', processDragOverOrEnter);
          element.bind('dragenter', processDragOverOrEnter);
          return element.bind('drop', function(event) {
            var file, name, reader, size, type;
            if (event != null) {
              event.preventDefault();
            }
            reader = new FileReader();
            reader.onload = function(evt) {
              if (checkSize(size) && isTypeValid(type)) {
                return scope.$apply(function() {
                  scope.file = evt.target.result;
                  if (angular.isString(scope.fileName)) {
                    return scope.fileName = name;
                  }
                });
              }
            };
            if(event.dataTransfer.files[0]) {
              file = event.dataTransfer.files[0];
              name = file.name;
              type = file.type;
              size = file.size;
              reader.readAsDataURL(file);
              return false;
            } else {
              return false;
            }
          });
        }
      };
    });

}).call(this);