require 'net/http'

class LoadTest
  SERVER = "http://localhost:3000/api/set/"
  ACCOUNT_NUMBER = 2
  ACCOUNT_KEY = "a"

  ACTIONS = ["b","n","p","m"]
  VALUES = [1,5,10,15]

  def self.user_list(len)
    (1 .. len)
  end

  def self.do(a,b)

    t = Time.now
    tt = t

    1000.times{
      (a .. b).each{|uid|
        10.times{
          send({:uuid=>uid, :code=>ACTIONS.shuffle.first, :value=>VALUES.shuffle.first})
        }
        p Time.now - tt
        tt= Time.now
      }
    }

    p "="*50
    p Time.now - t
    p "="*50
  end

  def self.send(args)
    args.merge!({
      #:with_info=>true,
      :a_id=>ACCOUNT_NUMBER,
      :k=>ACCOUNT_KEY
    })

    uri = URI.parse(SERVER)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true if uri.scheme == 'https'
    response = Net::HTTP.post_form(uri, args)
  end

end