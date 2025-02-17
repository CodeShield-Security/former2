/* ========================================================================== */
// Connect
/* ========================================================================== */

sections.push({
    'category': 'Business Applications',
    'service': 'Connect',
    'resourcetypes': {
        'Customer Profiles Domains': {
            'columns': [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle'
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        formatter: primaryFieldFormatter,
                        footerFormatter: textFormatter
                    },
                    {
                        title: 'Properties',
                        colspan: 4,
                        align: 'center'
                    }
                ],
                [
                    {
                        field: 'defaultexpirationdays',
                        title: 'Default Expiration Days',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    }
                ]
            ]
        },
        'Customer Profiles Object Types': {
            'columns': [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle'
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        formatter: primaryFieldFormatter,
                        footerFormatter: textFormatter
                    },
                    {
                        title: 'Properties',
                        colspan: 4,
                        align: 'center'
                    }
                ],
                [
                    {
                        field: 'domainname',
                        title: 'Domain Name',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    },
                    {
                        field: 'description',
                        title: 'Description',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    }
                ]
            ]
        },
        'Customer Profiles Integrations': {
            'columns': [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle'
                    },
                    {
                        title: 'Object Type Name',
                        field: 'objecttypename',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        formatter: primaryFieldFormatter,
                        footerFormatter: textFormatter
                    },
                    {
                        title: 'Properties',
                        colspan: 4,
                        align: 'center'
                    }
                ],
                [
                    {
                        field: 'domainname',
                        title: 'Domain Name',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    },
                    {
                        field: 'uri',
                        title: 'URI',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    }
                ]
            ]
        },
        'Quick Connects': {
            'columns': [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle'
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        formatter: primaryFieldFormatter,
                        footerFormatter: textFormatter
                    },
                    {
                        title: 'Properties',
                        colspan: 4,
                        align: 'center'
                    }
                ],
                [
                    {
                        field: 'description',
                        title: 'Description',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    },
                    {
                        field: 'instancearn',
                        title: 'Instance ARN',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    }
                ]
            ]
        }
    }
});

async function updateDatatableBusinessApplicationsConnect() {
    blockUI('#section-businessapplications-connect-customerprofilesdomains-datatable');
    blockUI('#section-businessapplications-connect-customerprofilesobjecttypes-datatable');
    blockUI('#section-businessapplications-connect-customerprofilesintegrations-datatable');
    blockUI('#section-businessapplications-connect-quickconnects-datatable');

    await sdkcall("CustomerProfiles", "listDomains", {
        // no params
    }, true).then(async (data) => {
        $('#section-businessapplications-connect-customerprofilesdomains-datatable').deferredBootstrapTable('removeAll');
        $('#section-businessapplications-connect-customerprofilesobjecttypes-datatable').deferredBootstrapTable('removeAll');
        $('#section-businessapplications-connect-customerprofilesintegrations-datatable').deferredBootstrapTable('removeAll');

        await Promise.all(data.Items.map(async (item) => {
            await sdkcall("CustomerProfiles", "getDomain", {
                DomainName: item.DomainName
            }, true).then(async (data) => {
                $('#section-businessapplications-connect-customerprofilesdomains-datatable').deferredBootstrapTable('append', [{
                    f2id: data.DomainName,
                    f2type: 'connect.customerprofilesdomain',
                    f2data: data,
                    f2region: region,
                    name: data.DomainName,
                    defaultexpirationdays: data.DefaultExpirationDays
                }]);
            });

            await sdkcall("CustomerProfiles", "listProfileObjectTypes", {
                DomainName: item.DomainName
            }, true).then(async (data) => {
                await Promise.all(data.Items.map(item2 => {
                    return sdkcall("CustomerProfiles", "getProfileObjectType", {
                        DomainName: item.DomainName,
                        ObjectTypeName: item2.ObjectTypeName
                    }, true).then(async (data) => {
                        data['DomainName'] = item.DomainName;

                        $('#section-businessapplications-connect-customerprofilesobjecttypes-datatable').deferredBootstrapTable('append', [{
                            f2id: data.ObjectTypeName,
                            f2type: 'connect.customerprofilesobjecttype',
                            f2data: data,
                            f2region: region,
                            name: data.ObjectTypeName,
                            domainname: item.DomainName,
                            description: data.Description
                        }]);
                    });
                }));
            });

            return sdkcall("CustomerProfiles", "listIntegrations", {
                DomainName: item.DomainName
            }, true).then(async (data) => {
                data.Items.forEach(integration => {
                    $('#section-businessapplications-connect-customerprofilesintegrations-datatable').deferredBootstrapTable('append', [{
                        f2id: integration.DomainName + " " + integration.ObjectTypeName + " Integration " + integration.Uri,
                        f2type: 'connect.customerprofilesintegration',
                        f2data: integration,
                        f2region: region,
                        objecttypename: integration.ObjectTypeName,
                        domainname: integration.DomainName,
                        uri: integration.Uri
                    }]);
                });
            });
        }));
    });

    await sdkcall("Connect", "listInstances", {
        // no params
    }, false).then(async (data) => {
        await Promise.all(data.InstanceSummaryList.map(async (instance) => {
            return sdkcall("Connect", "listQuickConnects", {
                InstanceId: instance.Id
            }, true).then(async (data) => {
                $('#section-businessapplications-connect-quickconnects-datatable').deferredBootstrapTable('removeAll');

                await Promise.all(data.QuickConnectSummaryList.map(quickconnect => {
                    return sdkcall("Connect", "describeQuickConnect", {
                        InstanceId: instance.Id,
                        QuickConnectId: quickconnect.Id
                    }, true).then(async (data) => {
                        data.QuickConnect['InstanceArn'] = instance.Arn;

                        $('#section-businessapplications-connect-quickconnects-datatable').deferredBootstrapTable('append', [{
                            f2id: data.QuickConnect.QuickConnectARN,
                            f2type: 'connect.quickconnect',
                            f2data: data.QuickConnect,
                            f2region: region,
                            name: data.QuickConnect.Name,
                            description: data.QuickConnect.Description,
                            instancearn: instance.Id
                        }]);
                    });
                }));
            }).catch(() => { });
        }));
    }).catch(() => { });
    
    unblockUI('#section-businessapplications-connect-customerprofilesdomains-datatable');
    unblockUI('#section-businessapplications-connect-customerprofilesobjecttypes-datatable');
    unblockUI('#section-businessapplications-connect-customerprofilesintegrations-datatable');
    unblockUI('#section-businessapplications-connect-quickconnects-datatable');
}

service_mapping_functions.push(function(reqParams, obj, tracked_resources){
    if (obj.type == "connect.customerprofilesdomain") {
        reqParams.cfn['DomainName'] = obj.data.DomainName;
        reqParams.cfn['DefaultEncryptionKey'] = obj.data.DefaultEncryptionKey;
        reqParams.cfn['DefaultExpirationDays'] = obj.data.DefaultExpirationDays;
        reqParams.cfn['DeadLetterQueueUrl'] = obj.data.DeadLetterQueueUrl;
        if (obj.data.Tags) {
            reqParams.cfn['Tags'] = [];
            for (var k in obj.data.Tags) {
                reqParams.cfn['Tags'].push({
                    'Key': k,
                    'Value': obj.data.Tags[k]
                });
            }
        }

        tracked_resources.push({
            'obj': obj,
            'logicalId': getResourceName('connect', obj.id, 'AWS::CustomerProfiles::Domain'),
            'region': obj.region,
            'service': 'connect',
            'type': 'AWS::CustomerProfiles::Domain',
            'options': reqParams,
            'returnValues': {
                'Ref': obj.data.DomainName
            }
        });
    } else if (obj.type == "connect.customerprofilesobjecttype") {
        reqParams.cfn['ObjectTypeName'] = obj.data.ObjectTypeName;
        reqParams.cfn['Description'] = obj.data.Description;
        reqParams.cfn['TemplateId'] = obj.data.TemplateId;
        reqParams.cfn['ExpirationDays'] = obj.data.ExpirationDays;
        reqParams.cfn['EncryptionKey'] = obj.data.EncryptionKey;
        reqParams.cfn['DomainName'] = obj.data.DomainName;
        reqParams.cfn['AllowProfileCreation'] = obj.data.AllowProfileCreation;
        if (obj.data.Fields) {
            reqParams.cfn['Fields'] = [];
            Object.keys(obj.data.Fields).forEach(k => {
                reqParams.cfn['Fields'].push({
                    'Name': k,
                    'ObjectTypeField': obj.data.Fields[k]
                });
            });
        }
        if (obj.data.Keys) {
            reqParams.cfn['Keys'] = [];
            Object.keys(obj.data.Keys).forEach(k => {
                reqParams.cfn['Keys'].push({
                    'Name': k,
                    'ObjectTypeKeyList': obj.data.Keys[k]
                });
            });
        }
        if (obj.data.Tags) {
            reqParams.cfn['Tags'] = [];
            for (var k in obj.data.Tags) {
                reqParams.cfn['Tags'].push({
                    'Key': k,
                    'Value': obj.data.Tags[k]
                });
            }
        }

        tracked_resources.push({
            'obj': obj,
            'logicalId': getResourceName('connect', obj.id, 'AWS::CustomerProfiles::ObjectType'),
            'region': obj.region,
            'service': 'connect',
            'type': 'AWS::CustomerProfiles::ObjectType',
            'options': reqParams
        });
    } else if (obj.type == "connect.customerprofilesintegration") {
        reqParams.cfn['ObjectTypeName'] = obj.data.ObjectTypeName;
        reqParams.cfn['DomainName'] = obj.data.DomainName;
        reqParams.cfn['Uri'] = obj.data.Uri;
        if (obj.data.Tags) {
            reqParams.cfn['Tags'] = [];
            for (var k in obj.data.Tags) {
                reqParams.cfn['Tags'].push({
                    'Key': k,
                    'Value': obj.data.Tags[k]
                });
            }
        }

        tracked_resources.push({
            'obj': obj,
            'logicalId': getResourceName('connect', obj.id, 'AWS::CustomerProfiles::Integration'),
            'region': obj.region,
            'service': 'connect',
            'type': 'AWS::CustomerProfiles::Integration',
            'options': reqParams
        });
    } else if (obj.type == "connect.quickconnect") {
        reqParams.cfn['Name'] = obj.data.Name;
        reqParams.cfn['Description'] = obj.data.Description;
        reqParams.cfn['InstanceArn'] = obj.data.InstanceArn;
        if (obj.data.QuickConnectConfig) {
            var userconfig = null;
            if (obj.data.QuickConnectConfig.UserConfig) {
                userconfig = {
                    'UserArn': obj.data.InstanceArn + '/agent/' + obj.data.QuickConnectConfig.UserConfig.UserId,
                    'ContactFlowArn': obj.data.InstanceArn + '/contact-flow/' + obj.data.QuickConnectConfig.UserConfig.ContactFlowId
                };
            }
            var queueconfig = null;
            if (obj.data.QuickConnectConfig.QueueConfig) {
                queueconfig = {
                    'QueueArn': obj.data.InstanceArn + '/queue/' + obj.data.QuickConnectConfig.QueueConfig.QueueId,
                    'ContactFlowArn': obj.data.InstanceArn + '/contact-flow/' + obj.data.QuickConnectConfig.QueueConfig.ContactFlowId
                };
            }

            reqParams.cfn['QuickConnectConfig'] = {
                'QuickConnectType': obj.data.QuickConnectConfig.QuickConnectType,
                'UserConfig': userconfig,
                'QueueConfig': queueconfig,
                'PhoneConfig': obj.data.QuickConnectConfig.PhoneConfig
            };
        }
        if (obj.data.Tags) {
            reqParams.cfn['Tags'] = [];
            for (var k in obj.data.Tags) {
                reqParams.cfn['Tags'].push({
                    'Key': k,
                    'Value': obj.data.Tags[k]
                });
            }
        }

        tracked_resources.push({
            'obj': obj,
            'logicalId': getResourceName('connect', obj.id, 'AWS::Connect::QuickConnect'),
            'region': obj.region,
            'service': 'connect',
            'type': 'AWS::Connect::QuickConnect',
            'options': reqParams,
            'returnValues': {
                'Ref': obj.data.Name,
                'GetAtt': {
                    'QuickConnectArn': obj.data.QuickConnectARN
                }
            }
        });
    } else {
        return false;
    }

    return true;
});
