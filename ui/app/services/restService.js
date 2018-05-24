'use strict';

angular.module('myApp.restService', ['ngCookies'])
    .service('RestService', ['$http', '$window', '$timeout', '$cookies',
        function ($http, $window, $timeout, $cookies) {
            var BACKEND_BASE_URL  = 'http://localhost:4000';
            var FRONTEND_BASE_URL = 'http://localhost:8000';

            var parseJwt = function(token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse($window.atob(base64));
            };

            var sortByName = function(a, b){
                var nameA = a.lastName.toUpperCase();
                var nameB = b.lastName.toUpperCase();

                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            };

            var Service = function (){};
            Service.jwt = '';
            Service.bearer = '';
            // Service.assignments = {};
            // Service.globalSettings = {};
            Service.contacts = [];
            Service.conversations = [];
            // Service.instructors = [];
            // Service.courses = [];
            // Service.submissions = {};
            Service.user = {};

            Service.setUser = function (user) {
                this.user = user;
            };

            Service.setJWT = function (jwt) {
                this.jwt = jwt;
                this.bearer = 'Bearer '+this.jwt;
                $http.defaults.headers.common['Authorization'] = this.bearer;
            };

            Service.authenticate = function (username, password) {
                var self = this;
                return $http.post(BACKEND_BASE_URL+'/authenticate', {username: username, password: password})
                    .then(function (response) {
                        if (response.data.error) {
                            console.log('Authentication failed: '+response.data.error);
                            throw response.data.error
                        } else {
                            self.jwt = response.data.token;
                            self.bearer = 'Bearer '+self.jwt;
                            $http.defaults.headers.common['Authorization'] = self.bearer;
                            localStorage.setItem('g3JWT', self.jwt);
//                            $cookies.put('oatJWT', self.jwt);
                            //return the payload out of the jwt
                            return parseJwt(self.jwt);
                        }
                    });
            };

            Service.logout = function () {
                var self = this;
                self.jwt = '';
                self.bearer = '';
                $http.defaults.headers.common['Authorization'] = '';
                localStorage.setItem('g3JWT', self.jwt);
//                $cookies.remove('oatJWT');
            };

            Service.getContacts = function () {
                var self = this;
                return $http.get(BACKEND_BASE_URL+'/contact')
                    .then(function (response) {
                        response.data.sort( sortByName );
                        self.contacts = _.clone(response.data);
                        return response.data;
                    });
            };

            Service.addContact = function (contact) {
                var self = this;
                return $http.post(BACKEND_BASE_URL+'/contact', contact)
                    .then(function (response) {
                        //success
                        return response.data;
                    })
                    .catch(function(response) {
                        //error
                        console.error('Add contact API error', response.status, response.data);
                        throw('Add contact error: '+response.data);
                    });
            };

            Service.updateContact = function (contact) {
                return $http.put(BACKEND_BASE_URL+'/contact', contact)
                    .then(function (response) {
                        //success
                        return response.data;
                    })
                    .catch(function(response) {
                        //error
                        console.error('Update contact API error', response.status, response.data);
                        throw('Update contact error: '+response.data);
                    });
            };

            Service.deleteContacts = function (contactIdArray){
                // use this long format of $http.delete so we can pass a body of contactIds along as payload
                return $http({
                    method: 'DELETE',
                    url: BACKEND_BASE_URL+'/contact',
                    data: contactIdArray,
                    headers: {'Content-Type': 'application/json;charset=utf-8'}
                }).then(function (response) {
                    return response.data;
                }).catch(function(response) {
                    //error
                    console.error('Delete contact API error', response.status, response.data);
                    throw('Failed to delete contact. Check for log error.');
                });
            };


            /*

             Service.getGlobalSettings = function () {
             var self = this;
             return $http.get(BACKEND_BASE_URL+'/settings/global')
             .then(function (response) {
             self.globalSettings = _.clone(response.data[0].values);
             return self.globalSettings;
             });
             };


                        Service.getCourses = function () {
                            var self = this;
                            var endpoint = '/courses';
                            if(this.user.role==='instructor'){
                                endpoint = '/courses/instructor/'+self.user.uid;
                            } else if(this.user.role==='student'){
                                endpoint = '/courses/student/'+self.user.uid;
                            }
                            return $http.get(BACKEND_BASE_URL+endpoint)
                                .then(function (response) {
                                    response.data.sort( sortByName );
                                    self.courses = _.clone(response.data);
                                    return response.data;
                                });
                        };

                        Service.getInstructors = function () {
                            var self = this;
                            return $http.get(BACKEND_BASE_URL+'/instructors')
                                .then(function (response) {
                                    self.instructors = _.clone(response.data);
                                    return response.data;
                                });
                        };

                        Service.getStudents = function () {
                            var self = this;
                            return $http.get(BACKEND_BASE_URL+'/students')
                                .then(function (response) {
                                    self.students = _.clone(response.data);
                                    return response.data;
                                });
                        };

                        Service.addStudent = function (student) {
                            var self = this;
                            return $http.post(BACKEND_BASE_URL + '/register', student)
                                .then(function (response) {
                                    //success
                                    return response.data;
                                })
                                .catch(function (response) {
                                    //error
                                    console.error('Add Student API error', response.status, response.data);
                                    throw('Add student error: '+response.data);
                                });
                        };

                        Service.updateStudent = function (student) {
                            return $http.put(BACKEND_BASE_URL+'/register', student)
                                .then(function (response) {
                                    //success
                                    return response.data;
                                })
                                .catch(function(response) {
                                    //error
                                    console.error('Update Student API error', response.status, response.data);
                                    throw('Update student error: '+response.data);
                                });
                        };

                        Service.deleteStudents = function (instructorIdArray){
                            var self = this;
                            // use this long format of $http.delete so we can pass a body of studentIds along as payload
                            return $http({
                                method: 'DELETE',
                                url: BACKEND_BASE_URL+'/students',
                                data: instructorIdArray,
                                headers: {'Content-Type': 'application/json;charset=utf-8'}
                            }).then(function (response) {
                                return response.data;
                            }).catch(function(response) {
                                //error
                                console.error('Delete Students API error', response.status, response.data);
                                throw('Failed to delete students. Check for log error.');
                            });
                        };

                        Service.setGlobalSettings = function(settings) {
                            var self = this;
                            return $http.post(BACKEND_BASE_URL+'/settings/global', {type: 'global', values: settings})
                                .then(function (response) {
                                    self.globalSettings = _.clone(settings);
                                    return response;
                                });
                        };



                        Service.saveNewCourse = function (newCourse) {
                            var self = this;
                            return $http.post(BACKEND_BASE_URL+'/courses', newCourse)
                                .then(function (response) {
                                    //success
                                    self.getCourses();
                                    return response.data;
                                })
                                .catch(function(response) {
                                    //error
                                    console.error('Save New Course API error', response.status, response.data);
                                    throw('Failed to save new course. Check for log error.');
                                });
                        };

                        Service.updateCourse = function (newCourse) {
                            var self = this;
                            return $http.put(BACKEND_BASE_URL+'/courses/'+newCourse.uid, newCourse)
                                .then(function (response) {
                                    //success
                                    self.getCourses();
                                    return response.data;
                                })
                                .catch(function(response) {
                                    //error
                                    console.error('Update Course API error', response.status, response.data);
                                    throw('Failed to update course. Check for log error.');
                                });
                        };

                        Service.deleteCourse = function (uid) {
                            var self = this;
                            return $http.delete(BACKEND_BASE_URL+'/courses/'+uid)
                                .then(function (response) {
                                    //success
                                    self.getCourses();
                                    return response.data;
                                })
                                .catch(function(response) {
                                    //error
                                    console.error('Delete Course API error', response.status, response.data);
                                    throw('Failed to delete course. Check for log error.');
                                });
                        };

                        Service.saveNewAssignment = function (newAssignment) {
                            var self = this;
                            return $http.post(BACKEND_BASE_URL+'/courses/'+newAssignment.courseUid+'/assignments', newAssignment)
                                .then(function (response) {
                                    //success
                                    return response.data;
                                })
                                .catch(function(response) {
                                    //error
                                    console.error('Save New Assignment API error', response.status, response.data);
                                    throw('Failed to save new assignment. Check for log error.');
                                });
                        };

                        Service.getAssignments = function (courseUid) {
                            var self = this;
                            return $http.get(BACKEND_BASE_URL+'/courses/'+courseUid+'/assignments')
                                .then(function (response) {
                                    response.data.sort( sortByName );
                                    self.assignments[courseUid] = _.clone(response.data);
                                    return self.assignments[courseUid];
                                });
                        };

                        Service.getSubmissions = function (courseUid) {
                            var self = this;
                            var course = _.findWhere(self.courses, {uid: courseUid});
                            var endpoint = '';
                            if( self.user.role === 'admin' || self.user.role === 'instructor'){
                                //admin/instructors get all submissions for the course no matter what setting is applied
                                endpoint = '/courses/'+courseUid+'/submissions';
                                return $http.get(BACKEND_BASE_URL+endpoint)
                                    .then(function (response) {
                                        self.submissions[courseUid] = _.clone(response.data);
                                        return self.submissions[courseUid];
                                    });
                            } else {
                                if(course){
                                    if( course.settings.canDownload ){
                                        //allowed to see everyone submissions so get them all
                                        endpoint = '/courses/'+courseUid+'/submissions';
                                    } else {
                                        //only their own
                                        endpoint = '/courses/'+courseUid+'/submissions/student/'+self.user.uid;
                                    }
                                    return $http.get(BACKEND_BASE_URL+endpoint)
                                        .then(function (response) {
                                            self.submissions[courseUid] = _.clone(response.data);
                                            return self.submissions[courseUid];
                                        });
                                } else {
                                    //error
                                    console.log('');
                                    console.error('Unable to find the course settings to know what to get.');
                                    throw('Unable to find course settings. Check for log error.');
                                }
                            }

                        };

                        Service.deleteAssignment = function (uid) {
                            var self = this;
                            return $http.delete(BACKEND_BASE_URL+'/assignments/'+uid)
                                .then(function (response) {
                                    //success
                                    //TODO: need to reload assignments for this course but we don't have the courseId
                                    // currently we get away with it by calling OatRestService.getAssignments() back
                                    // where this is called from which triggers things
            //                    self.getCourses();
                                    return response.data;
                                })
                                .catch(function(response) {
                                    //error
                                    console.error('Delete Assignment API error', response.status, response.data);
                                    throw('Failed to delete assignment. Check for log error.');
                                });
                        };

                        Service.deleteSubmission = function (uid) {
                            var self = this;
                            return $http.delete(BACKEND_BASE_URL+'/submissions/'+uid)
                                .then(function (response) {
                                    //success
                                    //TODO: need to reload submissions for this course but we don't have the courseId
                                    // currently we get away with it by calling OatRestService.getSubmissions() back
                                    // where this is called from which triggers things
            //                    self.getCourses();
                                    return response.data;
                                })
                                .catch(function(response) {
                                    //error
                                    console.error('Delete Submission API error', response.status, response.data);
                                    throw('Failed to delete submission. Check for log error.');
                                });
                        };

                        Service.updateAssignment = function (newAssignment) {
                            var self = this;
                            return $http.put(BACKEND_BASE_URL+'/assignments/'+newAssignment.uid, newAssignment)
                                .then(function (response) {
                                    //success
                                    self.getAssignments(newAssignment.courseUid);
                                    return response.data;
                                })
                                .catch(function(response) {
                                    //error
                                    console.error('Save New Assignment API error', response.status, response.data);
                                    throw('Failed to save new assignment. Check for log error.');
                                });
                        };
            */
/*
            Service.uploadAssignment = function (fileItem, assignmentUid) {
                var fd = new FormData();
                fd.append("file", fileItem._file);
                return $http.post(FRONTEND_BASE_URL+'/upload/assignments/'+assignmentUid, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .then(function (response) {
                        //success
                        return response.data;
                    })
                    .catch(function(response) {
                        //error
                        console.error('Upload Assignment API error', response.status, response.data);
                        throw('Failed to upload assignment. Check for log error.');
                    });

            };

            Service.saveNewSubmission = function (newSubmission) {
                var self = this;
                return $http.post(BACKEND_BASE_URL+'/assignments/'+newSubmission.assignmentUid+'/submissions', newSubmission)
                    .then(function (response) {
                        //success
                        return response.data;
                    })
                    .catch(function(response) {
                        //error
                        console.error('Save New Submission API error', response.status, response.data);
                        throw('Failed to save new submission. Check for log error.');
                    });
            };

            Service.uploadSubmission = function (fileItem, submissionUid) {
                var fd = new FormData();
                fd.append("file", fileItem._file);
                return $http.post(FRONTEND_BASE_URL+'/upload/submissions/'+submissionUid, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .then(function (response) {
                        //success
                        return response.data;
                    })
                    .catch(function(response) {
                        //error
                        console.error('Upload Submission API error', response.status, response.data);
                        throw('Failed to upload submission. Check for log error.');
                    });
            };
*/
            if (!Service.jwt){
                var self = this;
                //on page reload we may need to regrab the jwt
                var jwtFromStorage = localStorage.getItem('g3JWT');
                if(jwtFromStorage){
                    self.jwt = jwtFromStorage;
                    self.bearer = 'Bearer '+self.jwt;
                    $http.defaults.headers.common['Authorization'] = self.bearer;
                }
            }

            return Service;
        }]);
