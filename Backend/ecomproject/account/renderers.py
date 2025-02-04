from rest_framework import renderers
import json 

class UserRenderer(renderers.JSONRenderer):
    charset='utf-8'
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = json.dumps({'errors': data}) if 'ErrorDetail' in str(data) else json.dumps(data)
        return response
